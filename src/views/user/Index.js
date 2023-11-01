import React, {useState, useEffect} from "react"
import useFetch from 'use-http'
import Paginate from '../../components/Paginate'
import { useHistory } from "react-router-dom"
import { BsThreeDots } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import CustomDivToggle from "components/CustomDivToggle"
import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min"

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
  const {companyId} = useParams()
  const [users, setusers] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { get, post, response, loading, error } = useFetch()
  useEffect(() => { loadInitialusers() }, [currentPage]) 
  const history = useHistory();
  const addUser = () => {
      history.push(`/companies/${companyId}/users/add`);
  } 



  async function loadInitialusers() {
    const initialusers = await get(`/v1/platform_admin/companies/${companyId}/users?page=${currentPage}`)
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
                <Row>
                  <Col md="8">
                  <Card.Title as="h4"> Companies </Card.Title>
                  </Col>
                  <Col md="4" className="align-right">
                    <Button onClick={addUser}>Add User</Button>
                  </Col>
                </Row>
                
                
                
                
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
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
                  {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.mobile_number}</td>
                        <td>{user.username}</td>
                        <td>{user.role.id}</td>
                        <td>{user.created_at.substring(0, 10)}</td>
                        <td>
                          <Dropdown key={user.id}>
                            <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: "pointer" }}>
                              <BsThreeDots />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item key={`edit-${user.id}`} as={Link} to={`/companies/${companyId}/users/${user.id}/edit`}>
                                Edit
                              </Dropdown.Item>
            
                              <Dropdown.Item key={`user-show-${user.id}`} as={Link} to={`/companies/${companyId}/users/${user.id}`}>
                                User Show
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
