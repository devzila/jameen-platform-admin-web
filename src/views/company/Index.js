import React, { useState, useEffect } from "react"
import useFetch from 'use-http'
import Paginate from '../../components/Paginate'
import { useHistory } from "react-router-dom"
import { BsThreeDots } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import CustomDivToggle from "./CustomDivToggle";
import { Link } from "react-router-dom/cjs/react-router-dom.min";



// react-bootstrap components
import {
  Button,
  Card,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function Index() {
  const [companies, setCompanies] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { get, post, response, loading, error } = useFetch()
  useEffect(() => { loadInitialCompanies() }, [currentPage])
  const history = useHistory();
  const addCompany = () => {
    history.push("/companies/add");
  }

  async function loadInitialCompanies() {
    const initialCompanies = await get(`/v1/platform_admin/companies?page=${currentPage}`)
    if (response.ok) {
      setCompanies(initialCompanies.data.companies)
      setPagination(initialCompanies.data.pagination)
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
                <Card.Title as="h4">Companies</Card.Title>
                <Button onClick={addCompany}>Add Company</Button>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">Name</th>
                      <th className="border-0">Identifier</th>
                      <th className="border-0">Max Compound</th>
                      <th className="border-0">Crated At</th>
                      <th className="border-0">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map(company =>
                      <tr id={company.id}>
                        <td>{company.name}</td>
                        <td>{company.slug}</td>
                        <td>{company.max_compound}</td>
                        <td>{company.created_at.substring(0, 10)}</td>
                        <td>
                          <Dropdown key={company.id}>
                            <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: "pointer" }}>
                              <BsThreeDots />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item><Link to="/companies/:id/edit">Edit</Link></Dropdown.Item>
                              <Dropdown.Item><Link to="/companies/:id/users">User</Link></Dropdown.Item>
                              <Dropdown.Item><Link to="/companies/:id/">Show</Link></Dropdown.Item>
                              <Dropdown.Item><Link to="/companies/:id/users/:id">User Show</Link></Dropdown.Item>

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
