import React, { useState, useEffect } from "react";
import useFetch from "use-http";
import Paginate from "../../components/Paginate";
import { BsThreeDots } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import Loader from "components/Loader";
import dateFormat from "../../utilities/DateFormat";
import defaultLogo from "assets/img/jameen-logo.png";
import {
  PageShell,
  PageHeader,
  ContentCard,
  SearchInput,
  AdminButton,
  DataTable,
  EmptyState,
  StatusBadge,
  EntityCell,
} from "components/ui";

const COLUMNS = [
  { key: "company", label: "Company" },
  { key: "identifier", label: "Identifier" },
  { key: "country", label: "Country" },
  { key: "subscription", label: "Subscription" },
  { key: "status", label: "Status" },
  { key: "created", label: "Created" },
  { key: "action", label: "Action" },
];

function Index() {
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const { get, post, loading } = useFetch();
  const navigate = useNavigate();

  const loadInitialCompanies = async () => {
    let endpoint = `/v1/platform_admin/companies?page=${currentPage}`;

    if (searchKeyword.trim() !== "") {
      endpoint += `&q[name_cont]=${searchKeyword}`;
    }

    try {
      const data = await get(endpoint);
      setCompanies(data?.data || []);
      setPagination(data?.pagination || {});

      if (data?.pagination && currentPage > data.pagination.total_pages) {
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      loadInitialCompanies();
    }, 400);

    return () => clearTimeout(delay);
  }, [currentPage, searchKeyword]);

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1);
  };

  const toggleCompanyStatus = async (company) => {
    const action = company.active ? "deactivate" : "activate";

    if (!window.confirm(`Are you sure you want to ${action} this company?`)) {
      return;
    }

    try {
      await post(`/v1/platform_admin/companies/${company.id}/${action}`);
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === company.id ? { ...c, active: !c.active } : c
        )
      );
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <PageShell>
      <PageHeader
        title="Companies"
        subtitle="Manage tenant companies, subscriptions, and access."
        actions={
          <>
            <SearchInput
              value={searchKeyword}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchKeyword(e.target.value);
              }}
              onSearch={loadInitialCompanies}
              placeholder="Search company..."
            />
            <AdminButton onClick={() => navigate("/companies/add")}>
              Add Company
            </AdminButton>
          </>
        }
      />

      <ContentCard flush>
        <DataTable
          columns={COLUMNS}
          loading={loading ? <Loader /> : null}
          colSpan={COLUMNS.length}
          empty={
            <EmptyState
              colSpan={COLUMNS.length}
              title="No companies found"
              text="Create a company or refine your search."
            />
          }
        >
          {companies.length > 0
            ? companies.map((company) => (
                <tr key={company.id}>
                  <td>
                    <EntityCell
                      image={company.logo_url || defaultLogo}
                      title={company.name}
                      subtitle={company.slug}
                    />
                  </td>
                  <td className="cell-muted">{company.slug}</td>
                  <td>{company.country?.name_en || "-"}</td>
                  <td>{company.subscription?.name || "-"}</td>
                  <td>
                    <StatusBadge
                      active={!!company.active}
                      label={company.active ? "Active" : "Inactive"}
                    />
                  </td>
                  <td className="cell-muted">
                    {company.created_at
                      ? dateFormat(company.created_at.substring(0, 10))
                      : "-"}
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="light" size="sm">
                        <BsThreeDots />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          as={NavLink}
                          to={`/companies/${company.id}/edit`}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          as={NavLink}
                          to={`/companies/${company.id}/users`}
                        >
                          Users
                        </Dropdown.Item>
                        <Dropdown.Item
                          as={NavLink}
                          to={`/companies/${company.id}`}
                        >
                          Show
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                          onClick={() => toggleCompanyStatus(company)}
                        >
                          {company.active ? "Deactivate" : "Activate"}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
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
