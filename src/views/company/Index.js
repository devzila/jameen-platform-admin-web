import React, { useState, useEffect } from "react";
import useFetch from "use-http";
import Paginate from "../../components/Paginate";
import { BsThreeDots } from "react-icons/bs";
import { Dropdown, Badge } from "react-bootstrap";
import { Card, Container, Row, Col } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import Loader from "components/Loader";
import { CNavbar, CContainer, CNavbarBrand } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";

function Index() {
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const { get, post, loading } = useFetch();
  const navigate = useNavigate();

  const addCompany = () => {
    navigate(`/companies/add`);
  };

  // ✅ Load Companies
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

  // ✅ Toggle Status (FIXED)
  const toggleCompanyStatus = async (company) => {
    const action = company.active ? "deactivate" : "activate";

    if (!window.confirm(`Are you sure you want to ${action} this company?`)) return;

    const endpoint = `/v1/platform_admin/companies/${company.id}/${action}`;

    try {
      await post(endpoint);

      // ✅ Instant UI update (no reload)
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
    <Container fluid>
      <Row>
        <Col md="12">
          <Card>
            <CNavbar expand="lg" className="bg-white">
              <CContainer fluid>
                <CNavbarBrand>Companies</CNavbarBrand>

                <div className="d-flex justify-content-end">
                  <div className="d-flex align-items-center">
                    <input
                      value={searchKeyword}
                      onChange={(e) => {
                        setCurrentPage(1);
                        setSearchKeyword(e.target.value);
                      }}
                      className="form-control"
                      type="search"
                      placeholder="Search company..."
                    />

                    <button
                      onClick={loadInitialCompanies}
                      className="btn btn-outline-success"
                    >
                      <CIcon icon={freeSet.cilSearch} />
                    </button>
                  </div>

                  <button
                    className="btn btn-primary mx-2"
                    onClick={addCompany}
                  >
                    Add Company
                  </button>
                </div>
              </CContainer>
            </CNavbar>

            <Card.Body className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Identifier</th>
                    <th>Country</th>
                    <th>Subscription</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>

                {loading ? (
                  <tbody>
                    <tr>
                      <td colSpan="7">
                        <Loader />
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {companies.length > 0 ? (
                      companies.map((company) => (
                        <tr key={company.id}>
                          <td>{company.name}</td>
                          <td>{company.slug}</td>
                          <td>{company.country?.name_en}</td>
                          <td>{company.subscription?.name}</td>

                          {/* ✅ Status */}
                          <td>
                            {company.active ? (
                              <Badge bg="success">Active</Badge>
                            ) : (
                              <Badge bg="secondary">Inactive</Badge>
                            )}
                          </td>

                          <td>{company.created_at?.substring(0, 10)}</td>

                          {/* ✅ Actions */}
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
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No companies found
                        </td>
                      </tr>
                    )}
                  </tbody>
                )}
              </table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ✅ Pagination */}
      {pagination && (
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