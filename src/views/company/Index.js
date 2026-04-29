import React, { useState, useEffect } from "react";
import useFetch from "use-http";
import Paginate from "../../components/Paginate";
import { BsThreeDots } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import CustomDivToggle from "../../components/CustomDivToggle";
// react-bootstrap components
import { Button, Card, Table, Container, Row, Col } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import Loader from "components/Loader";
import { CNavbar, CContainer, CNavbarBrand, CCard } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import { formatdate } from "services/utility_functions";

function Index() {
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState(null);

  const { get, post, response, loading, error } = useFetch();
  useEffect(() => {
    loadInitialCompanies();
  }, [currentPage]);
  const navigate = useNavigate();
  const addCompany = () => {
    navigate(`/companies/add`);
  };

  async function loadInitialCompanies() {
    let endpoint = `/v1/platform_admin/companies?page=${currentPage}`;
    if (searchKeyword) {
      endpoint += `&q[name_cont]=${searchKeyword}`;
    }
    let initialCompanies = await get(endpoint);

    if (response.ok) {
      setCompanies(initialCompanies.data);
      setPagination(initialCompanies.pagination);
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1);
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <CNavbar expand="lg" colorScheme="light" className="bg-white">
                <CContainer fluid>
                  <CNavbarBrand href="#">Companies</CNavbarBrand>
                  <div className="d-flex justify-content-end">
                    <div className="d-flex align-items-center" role="search">
                      <input
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onReset={loadInitialCompanies}
                        className="form-control  custom_input"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                      />
                      <button
                        onClick={loadInitialCompanies}
                        className="btn btn-outline-success custom_search_button"
                        type="submit"
                      >
                        <CIcon icon={freeSet.cilSearch} />
                      </button>
                    </div>
                    <button
                      className="custom_theme_button btn m-0 mx-2"
                      onClick={addCompany}
                    >
                      Add Company
                    </button>
                  </div>
                </CContainer>
              </CNavbar>
              <hr className="p-0 m-0 text-secondary" />

              <Card.Body className="table-full-width table-responsive px-0">
                <div className="table-responsive bg-white">
                  <table className="table table-striped mb-1">
                    <thead>
                      <tr>
                        <th className="border-0">Name</th>
                        <th className="border-0">Identifier</th>
                        <th className="border-0">Country</th>

                        <th className="border-0">Subscription</th>
                        <th className="border-0">Crated At</th>
                        <th className="border-0">Action</th>
                      </tr>
                    </thead>
                    {loading ? (
                      <Loader />
                    ) : (
                      <tbody>
                        {companies.map((company) => (
                          <tr key={company.id}>
                            <td>{company.name}</td>
                            <td>{company.slug}</td>
                            <td>{company.country.name_en}</td>

                            <td>{company.subscription?.name}</td>
                            <td>{formatdate(company.created_at)}</td>
                            <td>
                              <Dropdown key={company.id}>
                                <Dropdown.Toggle
                                  as={CustomDivToggle}
                                  style={{ cursor: "pointer" }}
                                >
                                  <BsThreeDots />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item>
                                    <NavLink
                                      key={`edit-${company.id}`}
                                      to={`/companies/${company.id}/edit`}
                                    >
                                      Edit
                                    </NavLink>
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    <NavLink
                                      key={`companys-${company.id}`}
                                      to={`/companies/${company.id}/users`}
                                    >
                                      Users
                                    </NavLink>
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    <NavLink
                                      key={`show-${company.id}`}
                                      to={`/companies/${company.id}`}
                                    >
                                      Show
                                    </NavLink>
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            {pagination?.total_pages > 1 ? (
              <Paginate
                onPageChange={handlePageClick}
                pageRangeDisplayed={pagination.per_page}
                pageCount={pagination.total_pages}
                forcePage={currentPage - 1}
              />
            ) : (
              <br />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Index;
