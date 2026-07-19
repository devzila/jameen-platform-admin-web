import React, { useState, useEffect } from "react";
import useFetch from "use-http";
import Paginate from "../../components/Paginate";
import Loader from "components/Loader";
import { toast } from "react-toastify";
import {
  Badge,
  Button,
  Card,
  Container,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { CNavbar, CContainer, CNavbarBrand } from "@coreui/react";

const ENTITY_OPTIONS = [
  { value: "", label: "All entities" },
  { value: "Actors::User", label: "Actors::User" },
];

const ACTIVE_OPTIONS = [
  { value: "true", label: "Active" },
  { value: "false", label: "Revoked" },
  { value: "all", label: "All" },
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

    if (companySlug) {
      params.set("company_slug", companySlug);
    }
    if (userId.trim()) {
      params.set("user_id", userId.trim());
    }
    if (entity) {
      params.set("entity", entity);
    }
    if (active) {
      params.set("active", active);
    }

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

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1);
  };

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
    <Container fluid>
      <Row>
        <Col md="12">
          <Card>
            <CNavbar expand="lg" className="bg-white">
              <CContainer fluid>
                <CNavbarBrand>Login / Sessions</CNavbarBrand>
              </CContainer>
            </CNavbar>

            <Card.Body>
              <Row className="mb-3 align-items-end">
                <Col md="3" className="mb-2">
                  <Form.Group>
                    <Form.Label>Company</Form.Label>
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
                          {company.name} ({company.slug})
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col md="2" className="mb-2">
                  <Form.Group>
                    <Form.Label>User ID</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Filter by user id"
                      value={userId}
                      onChange={(e) => {
                        setCurrentPage(1);
                        setUserId(e.target.value);
                      }}
                    />
                  </Form.Group>
                </Col>

                <Col md="3" className="mb-2">
                  <Form.Group>
                    <Form.Label>Entity</Form.Label>
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
                  </Form.Group>
                </Col>

                <Col md="2" className="mb-2">
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
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
                  </Form.Group>
                </Col>

                <Col md="2" className="mb-2">
                  <Button
                    variant="outline-secondary"
                    className="w-100"
                    onClick={resetFilters}
                  >
                    Reset
                  </Button>
                </Col>
              </Row>

              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Company</th>
                      <th>Device</th>
                      <th>IP</th>
                      <th>Last used</th>
                      <th>Expires</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  {loading && !sessions.length ? (
                    <tbody>
                      <tr>
                        <td colSpan="8">
                          <Loader />
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>
                      {sessions.length > 0 ? (
                        sessions.map((session) => (
                          <tr key={session.id}>
                            <td>
                              <div>{session.user?.name || "-"}</div>
                              <small className="text-muted">
                                {session.user?.email || "-"}
                              </small>
                              {session.user?.id != null && (
                                <div>
                                  <small className="text-muted">
                                    ID: {session.user.id}
                                  </small>
                                </div>
                              )}
                            </td>
                            <td>
                              <div>{session.company?.name || "-"}</div>
                              <small className="text-muted">
                                {session.company?.slug || "-"}
                              </small>
                            </td>
                            <td>
                              <div>{session.device_name || "-"}</div>
                              <small
                                className="text-muted d-inline-block text-truncate"
                                style={{ maxWidth: "220px" }}
                                title={session.user_agent || ""}
                              >
                                {session.user_agent || "-"}
                              </small>
                            </td>
                            <td>{session.ip_address || "-"}</td>
                            <td>{formatDateTime(session.last_used_at)}</td>
                            <td>{formatDateTime(session.expires_at)}</td>
                            <td>
                              {session.active ? (
                                <Badge bg="success">Active</Badge>
                              ) : (
                                <Badge bg="secondary">Revoked</Badge>
                              )}
                              {session.revoked_at && (
                                <div>
                                  <small className="text-muted">
                                    {formatDateTime(session.revoked_at)}
                                  </small>
                                </div>
                              )}
                            </td>
                            <td>
                              {session.active ? (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  disabled={revokingId === session.id}
                                  onClick={() => handleRevoke(session)}
                                >
                                  {revokingId === session.id
                                    ? "Revoking..."
                                    : "Revoke"}
                                </Button>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center">
                            No sessions found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  )}
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {pagination?.total_pages > 0 && (
        <Row className="mt-3">
          <Col className="d-flex justify-content-center">
            <Paginate
              onPageChange={handlePageClick}
              pageCount={pagination.total_pages || 1}
              forcePage={currentPage - 1}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Index;
