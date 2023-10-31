import React, { useEffect, useState } from "react";
import useFetch from 'use-http'
import Paginate from '../../components/Paginate'
import { useHistory } from "react-router-dom"
import { BsThreeDots } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import CustomDivToggle from "../../components/CustomDivToggle";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import {
  Button,
  Card,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";


function Index() {
  const [subscriptions, setSubscriptions] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { get, post, response, loading, error } = useFetch()
  useEffect(() => { loadInitialSubscriptions() }, [currentPage])
  const history = useHistory();
  const addSubscription = () => {
    history.push(`/subscriptions/add`);
  }


  async function loadInitialSubscriptions() {
    const initialSubscriptions = await get(`/v1/platform_admin/subscriptions?page=${currentPage}`)
    if (response.ok) {
      setSubscriptions(initialSubscriptions.data.subscriptions)
      setPagination(initialSubscriptions.data.pagination)
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
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
                <Card.Title as="h4">subscriptions</Card.Title>
                <Button onClick={addSubscription}>Add Subscription</Button>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">Name</th>
                      <th className="border-0"> max_no_of_units</th>
                      <th className="border-0"> max_Compounds</th>
                      <th className="border-0">Crated At</th>
                      <th className="border-0">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {subscriptions.map(subscription => (
                      <tr key={subscription.id}>
                        <td>{subscription.name}</td>
                        <td>{subscription.max_no_of_units}</td>
                        <td>{subscription.max_no_of_compounds}</td>
                        <td>{subscription.created_at.substring(0, 10)}</td>
                        <td>
                          <Dropdown key={subscription.id}>
                            <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: "pointer" }}>
                              <BsThreeDots />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item key={`edit-${subscription.id}`} as={Link} to={`/subscriptions/${subscription.id}/edit`}>
                                Edit
                              </Dropdown.Item>
                              <Dropdown.Item key={`show-${subscription.id}`} as={Link} to={`/subscriptions/${subscription.id}`}>
                                Show
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
            {pagination ?
              <Paginate
                onPageChange={handlePageClick}
                pageRangeDisplayed={pagination.per_page}
                pageCount={pagination.total_pages}
                forcePage={currentPage - 1}
              />
              : <br />}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Index;
