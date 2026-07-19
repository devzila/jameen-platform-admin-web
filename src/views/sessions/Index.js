import React, { useState, useEffect } from "react";
import useFetch from "use-http";
import Paginate from "../../components/Paginate";
import Loader from "components/Loader";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";
import {
  PageShell,
  PageHeader,
  ContentCard,
  FilterBar,
  FilterField,
  AdminButton,
  DataTable,
  EmptyState,
  StatusBadge,
} from "components/ui";

const ENTITY_OPTIONS = [
  { value: "", label: "All entities" },
  { value: "Actors::User", label: "Actors::User" },
];

const ACTIVE_OPTIONS = [
  { value: "true", label: "Active" },
  { value: "false", label: "Revoked" },
  { value: "all", label: "All" },
];

const COLUMNS = [
  { key: "user", label: "User" },
  { key: "company", label: "Company" },
  { key: "device", label: "Device" },
  { key: "ip", label: "IP" },
  { key: "last_used", label: "Last used" },
  { key: "expires", label: "Expires" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

function formatDateTime(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString();
  } catch (e) {
    return value;
  }
}

function Index() {
  const [sessions, setSessions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [companySlug, setCompanySlug] = useState("");
  const [userId, setUserId] = useState("");
  const [entity, setEntity] = useState("");
  const [active, setActive] = useState("true");
  const [revokingId, setRevokingId] = useState(null);

  const { get, del, response, loading } = useFetch();

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      loadSessions();
    }, userId ? 400 : 0);

    return () => clearTimeout(delay);
  }, [currentPage, companySlug, userId, entity, active]);

  async function loadCompanies() {
    try {
      const data = await get("/v1/platform_admin/companies?status=active");
      setCompanies(data?.data || []);
    } catch (err) {
      console.error("Failed to load companies:", err);
    }
  }

  async function loadSessions() {
    const params = new URLSearchParams();
    params.set("page", String(currentPage));
    params.set("limit", "20");

    if (companySlug) params.set("company_slug", companySlug);
    if (userId.trim()) params.set("user_id", userId.trim());
    if (entity) params.set("entity", entity);
    if (active) params.set("active", active);

    try {
      const data = await get(
        `/v1/platform_admin/sessions?${params.toString()}`
      );
      setSessions(Array.isArray(data?.data) ? data.data : []);
      setPagination(data?.pagination || {});

      if (
        data?.pagination &&
        currentPage > data.pagination.total_pages &&
        data.pagination.total_pages > 0
      ) {
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
      toast.error("Failed to load sessions");
    }
  }

  const handlePageClick = (e) => setCurrentPage(e.selected + 1);

  const resetFilters = () => {
    setCompanySlug("");
    setUserId("");
    setEntity("");
    setActive("true");
    setCurrentPage(1);
  };

  const handleRevoke = async (session) => {
    if (
      !window.confirm(
        `Revoke session for ${session.user?.email || "this user"} on ${
          session.device_name || "this device"
        }?`
      )
    ) {
      return;
    }

    setRevokingId(session.id);
    try {
      await del(`/v1/platform_admin/sessions/${session.id}`);
      if (response.ok) {
        toast.success("Session revoked");
        loadSessions();
      } else {
        toast.error(response.data?.message || "Failed to revoke session");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to revoke session");
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <PageShell>
      <PageHeader
        title="Login / Sessions"
        subtitle="Monitor and revoke tenant login sessions across companies."
      />

      <ContentCard flush>
        <FilterBar
          actions={
            <AdminButton variant="secondary" onClick={resetFilters}>
              Reset
            </AdminButton>
          }
        >
          <FilterField label="Company">
            <Form.Control
              as="select"
              value={companySlug}
              onChange={(e) => {
                setCurrentPage(1);
                setCompanySlug(e.target.value);
              }}
            >
              <option value="">All companies</option>
              {companies.map((company) => (
                <option key={company.id} value={company.slug}>
                  {company.name}
                </option>
              ))}
            </Form.Control>
          </FilterField>

          <FilterField label="User ID">
            <Form.Control
              type="text"
              placeholder="Filter by user id"
              value={userId}
              onChange={(e) => {
                setCurrentPage(1);
                setUserId(e.target.value);
              }}
            />
          </FilterField>

          <FilterField label="Entity">
            <Form.Control
              as="select"
              value={entity}
              onChange={(e) => {
                setCurrentPage(1);
                setEntity(e.target.value);
              }}
            >
              {ENTITY_OPTIONS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Form.Control>
          </FilterField>

          <FilterField label="Status">
            <Form.Control
              as="select"
              value={active}
              onChange={(e) => {
                setCurrentPage(1);
                setActive(e.target.value);
              }}
            >
              {ACTIVE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Form.Control>
          </FilterField>
        </FilterBar>

        <DataTable
          columns={COLUMNS}
          loading={loading && !sessions.length ? <Loader /> : null}
          colSpan={COLUMNS.length}
          empty={
            <EmptyState
              colSpan={COLUMNS.length}
              title="No sessions found"
              text="Try a different company, user, or status filter."
            />
          }
        >
          {sessions.length > 0
            ? sessions.map((session) => (
                <tr key={session.id}>
                  <td>
                    <div className="cell-title">{session.user?.name || "-"}</div>
                    <span className="cell-sub">{session.user?.email || "-"}</span>
                    {session.user?.id != null ? (
                      <span className="cell-sub">ID: {session.user.id}</span>
                    ) : null}
                  </td>
                  <td>
                    <div className="cell-title">
                      {session.company?.name || "-"}
                    </div>
                    <span className="cell-sub">
                      {session.company?.slug || "-"}
                    </span>
                  </td>
                  <td>
                    <div className="cell-title">
                      {session.device_name || "-"}
                    </div>
                    <span
                      className="cell-sub d-inline-block text-truncate"
                      style={{ maxWidth: 220 }}
                      title={session.user_agent || ""}
                    >
                      {session.user_agent || "-"}
                    </span>
                  </td>
                  <td className="cell-muted">{session.ip_address || "-"}</td>
                  <td className="cell-muted">
                    {formatDateTime(session.last_used_at)}
                  </td>
                  <td className="cell-muted">
                    {formatDateTime(session.expires_at)}
                  </td>
                  <td>
                    <StatusBadge
                      active={!!session.active}
                      label={session.active ? "Active" : "Revoked"}
                      tone={session.active ? "success" : "muted"}
                    />
                    {session.revoked_at ? (
                      <span className="cell-sub">
                        {formatDateTime(session.revoked_at)}
                      </span>
                    ) : null}
                  </td>
                  <td>
                    {session.active ? (
                      <AdminButton
                        variant="danger"
                        size="sm"
                        disabled={revokingId === session.id}
                        onClick={() => handleRevoke(session)}
                      >
                        {revokingId === session.id ? "Revoking..." : "Revoke"}
                      </AdminButton>
                    ) : (
                      <span className="cell-muted">—</span>
                    )}
                  </td>
                </tr>
              ))
            : null}
        </DataTable>
      </ContentCard>

      {pagination?.total_pages > 0 ? (
        <Paginate
          onPageChange={handlePageClick}
          pageCount={pagination.total_pages || 1}
          forcePage={currentPage - 1}
        />
      ) : null}
    </PageShell>
  );
}

export default Index;
