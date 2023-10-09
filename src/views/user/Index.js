import React, {useState, useEffect} from "react"
import useFetch from 'use-http'
import Paginate from '../../components/Paginate'
import { useHistory } from "react-router-dom"
import CustomDivToggle from "components/CustomDivToggle"
import { Link } from "react-router-dom/cjs/react-router-dom.min"

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function Index() {
  const [users, setusers] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { get, post, response, loading, error } = useFetch()
  useEffect(() => { loadInitialusers() }, [currentPage]) 
  const history = useHistory();
  const addUser = () => {
      history.push("/admin/user/edit");
  } 

  async function loadInitialusers() {
    const initialusers = await get(`/v1/platform_admin/companies/1/users?page=${currentPage}`)
    if (response.ok) {
      setusers(initialusers.data.users)
      setPagination(initialusers.data.pagination)
    }
  }

  function handlePageClick(e){
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
                <Card.Title as="h4">Users</Card.Title>
                <Button onClick={addUser}>Add User</Button>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">Name</th>
                      <th className="border-0"></th>
                      <th className="border-0">Email Adress</th>
                      <th className="border-0">Ph_Number</th>
                      <th className="border-0">Crated At</th>
                      <th className="border-0">Updated At</th>
                      <th className="border-0"></th>

                    </tr>
                  </thead>
                  <tbody>
                  {users.map(user => 
                    <tr id={user.id}>
                      <td>{user.name}</td>
                      <td>{user.slug}</td>
                      <td>{user.email}</td>
                      <td>{user.mobile_number}</td>
                      <td>{user.created_at.substring(0, 10)}</td>
                      <td>
                          <Dropdown key={user.id}>
                            <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: "pointer" }}>
                              <BsThreeDots />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item><Link to={`/companies/${user.id}/edit`}>Edit</Link></Dropdown.Item>
                              <Dropdown.Item><Link to={`/companies/${user.id}/users`}>User</Link></Dropdown.Item>
                              <Dropdown.Item><Link to={`/companies/${user.id}/Show`}>Show</Link></Dropdown.Item>
                              <Dropdown.Item><Link to={`/companies/${user.id}/users/:id`}>User Show</Link></Dropdown.Item>

                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                    </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            { pagination ? 
            <Paginate
              onPageChange={handlePageClick}
              pageRangeDisplayed={pagination.per_page}
              pageCount={pagination.total_pages}
              forcePage={currentPage - 1}
            />
            : <br/> }
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Index;
