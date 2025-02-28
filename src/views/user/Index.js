import React, { useState, useEffect } from "react";
import useFetch from "use-http";
import Paginate from "../../components/Paginate";
import { BsThreeDots } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import CustomDivToggle from "components/CustomDivToggle";

// react-bootstrap components
import {
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { NavLink, useNavigate, useParams } from "react-router-dom";
function Index() {
  const { companyId } = useParams();
  const [users, setusers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { get, post, response, loading, error } = useFetch();
  useEffect(() => {
    loadInitialusers();
  }, [currentPage]);
  const navigate = useNavigate();
  const addUser = () => {
    navigate(`/companies/${companyId}/users/add`);
  };

  async function loadInitialusers() {
    const initialusers = await get(
      `/v1/platform_admin/companies/${companyId}/users?page=${currentPage}`
    );
    console.log(response);
    if (response.ok) {
      setusers(initialusers.data);
      setPagination(initialusers.data.pagination);
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
                    <button
                      className="custom_theme_button btn"
                      onClick={addUser}
                    >
                      Add User
                    </button>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <div className="table-responsive bg-white">
                  <table className="table table-striped mb-1">
                    <thead>
                      <tr>
                        <th className="border-0">Name</th>
                        <th className="border-0">Email id</th>
                        <th className="border-0">Ph_Number</th>
                        <th className="border-0">username</th>
                        <th className="border-0">role_id</th>
                        <th className="border-0">Crated At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.mobile_number}</td>
                          <td>{user.username}</td>
                          <td>{user.role.id}</td>
                          <td>{user.created_at.substring(0, 10)}</td>
                          <td>
                            <Dropdown key={user.id}>
                              <Dropdown.Toggle
                                as={CustomDivToggle}
                                style={{ cursor: "pointer" }}
                              >
                                <BsThreeDots />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item>
                                  <NavLink
                                    key={`edit-${user.id}`}
                                    to={`/companies/${companyId}/users/${user.id}/edit`}
                                  >
                                    Edit
                                  </NavLink>
                                </Dropdown.Item>

                                <Dropdown.Item>
                                  <NavLink
                                    key={`user-show-${user.id}`}
                                    to={`/companies/${companyId}/users/${user.id}`}
                                  >
                                    User Show
                                  </NavLink>
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))}
                    </tbody>
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
