import React, { useState, useEffect } from "react";
import useFetch from "use-http";
import Paginate from "../../components/Paginate";
import { BsThreeDots } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import CustomDivToggle from "../../components/CustomDivToggle";
import { Card, Container, Row, Col } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import Loader from "components/Loader";
import { CNavbar, CContainer, CNavbarBrand } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import { formatdate } from "services/utility_functions";

function Index() {
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const { get, response, loading } = useFetch();
  const navigate = useNavigate();

  const addCompany = () => {
    navigate(`/companies/add`);
  };

  const loadInitialCompanies = async () => {
    let endpoint = `/v1/platform_admin/companies?page=${currentPage}`;

    if (searchKeyword.trim() !== "") {
      endpoint += `&q[name_cont]=${searchKeyword}`;
    }

    const data = await get(endpoint);

    if (response.ok) {
      setCompanies(data.data || []);
      setPagination(data.pagination || {});

      // Fix: if current page exceeds total pages → reset
      if (data.pagination && currentPage > data.pagination.total_pages) {
        setCurrentPage(1);
      }
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadInitialCompanies();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [currentPage, searchKeyword]);

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1);
  };

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card className="strpied-tabled-with-hover">
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
                      className="form-control custom_input"
                      type="search"
                      placeholder="Search company..."
                    />

                    <button
                      onClick={loadInitialCompanies}
                      className="btn btn-outline-success custom_search_button"
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
                      <th>Name</th>
                      <th>Identifier</th>
                      <th>Country</th>
                      <th>Subscription</th>
                      <th>Created At</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  {loading ? (
                    <tbody>
                      <tr>
                        <td colSpan="6">
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
                            <td>{formatdate(company.created_at)}</td>
                            <td>
                              {company.created_at?.substring(0, 10)}
                            </td>

                            <td>
                              <Dropdown>
                                <Dropdown.Toggle
                                  as={CustomDivToggle}
                                  style={{ cursor: "pointer" }}
                                >
                                  <BsThreeDots />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                  <Dropdown.Item as="div">
                                    <NavLink to={`/companies/${company.id}/edit`}>
                                      Edit
                                    </NavLink>
                                  </Dropdown.Item>

                                  <Dropdown.Item as="div">
                                    <NavLink to={`/companies/${company.id}/users`}>
                                      Users
                                    </NavLink>
                                  </Dropdown.Item>

                                  <Dropdown.Item as="div">
                                    <NavLink to={`/companies/${company.id}`}>
                                      Show
                                    </NavLink>
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No companies found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  )}
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {pagination && (
        <Row className="mt-3">
          <Col className="d-flex justify-content-center">
            <Paginate
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              marginPagesDisplayed={2}
              pageCount={pagination.total_pages || 2}
              forcePage={currentPage - 1}
            />
          </Col>
        </Row>
      )}v
    </Container>
  );
}

export default Index;