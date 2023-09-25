import React, {useState, useEffect} from "react"
import useFetch from 'use-http'
import ReactPaginate from 'react-paginate'

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

function Company() {
  const [companies, setCompanies] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { get, post, response, loading, error } = useFetch()
  useEffect(() => { loadInitialCompanies() }, [currentPage]) 

  async function loadInitialCompanies() {
    const initialCompanies = await get(`/v1/platform_admin/companies?page=${currentPage}`)
    if (response.ok) {
      setCompanies(initialCompanies.data.companies)
      setPagination(initialCompanies.data.pagination)
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
                <Card.Title as="h4">Companies</Card.Title>
                <p className="card-category">
                  Company list
                </p>
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
                      <td>{company.created_at}</td>
                      <td>Oud-Turnhout</td>
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
            <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination justify-content-center"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              activeClassName="active"
              onPageChange={handlePageClick}
              pageRangeDisplayed={pagination.per_page}
              pageCount={pagination.total_pages}
              previousLabel="< previous"
              renderOnZeroPageCount={null}
              forcePage={currentPage - 1}
            />
            : <br/> }
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Company;
