import React, { useState, useEffect } from "react";
import useFetch from "use-http";
import Paginate from "../../components/Paginate";
import { BsThreeDots } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import CustomDivToggle from "../../components/CustomDivToggle";
// react-bootstrap components
import { Button, Card, Table, Container, Row, Col } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

function Index() {
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { get, post, response, loading, error } = useFetch();
  useEffect(() => {
    loadInitialCompanies();
  }, [currentPage]);
  const navigate = useNavigate();
  const addCompany = () => {
    navigate(`/companies/add`);
  };

  async function loadInitialCompanies() {
    const initialCompanies = await get(
      `/v1/platform_admin/companies?page=${currentPage}`
    );

    console.log(response);
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
      {error && error.Error}
      {loading && "Loading..."}

      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Row>
                  <Col md="8">
                    <Card.Title as="h4"> Companies </Card.Title>
                  </Col>
                  <Col md="4" className="align-right">
                    <Button onClick={addCompany}>Add Company</Button>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
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
                  <tbody>
                    {companies.map((company) => (
                      <tr key={company.id}>
                        <td>{company.name}</td>
                        <td>{company.slug}</td>
                        <td>{company.country.name_en}</td>

                        <td>{company.subscription?.name}</td>
                        <td>{company.created_at.substring(0, 10)}</td>
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
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            {pagination ? (
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
