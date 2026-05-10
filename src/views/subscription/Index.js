import React, { useEffect, useState } from "react";
import useFetch from "use-http";
import Paginate from "../../components/Paginate";
import { BsThreeDots } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import CustomDivToggle from "../../components/CustomDivToggle";
import { Button, Card, Table, Container, Row, Col } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import Loader from "components/Loader";
import { CNavbar, CContainer, CNavbarBrand, CCard } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import dateFormat from "../../utilities/DateFormat";

function Index() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const { get, response, loading, error } = useFetch();
  useEffect(() => {
    loadInitialSubscriptions();
  }, [currentPage]);
  const navigate = useNavigate();
  const addSubscription = () => {
    navigate(`/subscriptions/add`);
  };

  async function loadInitialSubscriptions() {
    let endpoint = `/v1/platform_admin/subscriptions?page=${currentPage}`;

    if (searchKeyword) {
      endpoint += `&q[name_cont]=${searchKeyword}`;
    }
    let initialSubscriptions = await get(endpoint);

    if (response.ok) {
      setSubscriptions(initialSubscriptions.data);
      setPagination(initialSubscriptions.pagination);
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
                  <CNavbarBrand href="#">Subscriptions </CNavbarBrand>

                  <div className="d-flex justify-content-end">
                    <div className="d-flex align-items-center" role="search">
                      <input
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onReset={loadInitialSubscriptions}
                        className="form-control  custom_input"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                      />
                      <div>
                        <button
                          onClick={loadInitialSubscriptions}
                          className="btn btn-outline-success custom_search_button"
                          type="submit"
                        >
                          <CIcon icon={freeSet.cilSearch} />
                        </button>
                      </div>
                    </div>
                    <button
                      className="custom_theme_button btn"
                      onClick={addSubscription}
                    >
                      Add Subscription
                    </button>
                  </div>
                </CContainer>
              </CNavbar>

              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">Name</th>
                      <th className="border-0"> Max no of units</th>
                      <th className="border-0"> Max Compounds</th>
                      <th className="border-0">Crated At</th>
                      <th className="border-0">Action</th>
                    </tr>
                  </thead>
                  {loading ? (
                    <Loader />
                  ) : (
                    <tbody>
                      {subscriptions?.map((subscription) => {
                          console.log(subscription.created_at.substring(0, 10));
                      return (
                        <tr key={subscription.id}>
                          <td>{subscription.name}</td>
                          <td>{subscription.max_no_of_units}</td>
                          <td>{subscription.max_no_of_compounds}</td>
                          <td>{dateFormat(subscription.created_at.substring(0, 10))}</td>
                          <td>
                            <Dropdown key={subscription.id}>
                              <Dropdown.Toggle
                                as={CustomDivToggle}
                                style={{ cursor: "pointer" }}
                              >
                                <BsThreeDots />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item>
                                  <NavLink
                                    key={`edit-${subscription.id}`}
                                    to={`/subscriptions/${subscription.id}/edit`}
                                  >
                                    Edit
                                  </NavLink>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                  <NavLink
                                    key={`show-${subscription.id}`}
                                    to={`/subscriptions/${subscription.id}`}
                                  >
                                    Show
                                  </NavLink>
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  )}
                </Table>
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
