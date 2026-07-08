import React, { useState, useEffect } from "react";
import useFetch from "use-http";
import Paginate from "../../components/Paginate";
import { BsThreeDots } from "react-icons/bs";
import { Dropdown, Badge } from "react-bootstrap";
import { Card, Container, Row, Col } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import Loader from "components/Loader";
import {
  CNavbar,
  CContainer,
  CNavbarBrand,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import dateFormat from "../../utilities/DateFormat";

function Index() {
  const [invoiceTemplates, setInvoiceTemplates] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const { get, del, loading } = useFetch();

  const navigate = useNavigate();

  const addTemplate = () => {
    navigate("/invoice-templates/add");
  };

  const loadInvoiceTemplates = async () => {
    let endpoint = `/v1/platform_admin/invoice_templates?page=${currentPage}`;

    if (searchKeyword.trim() !== "") {
      endpoint += `&q[name_cont]=${searchKeyword}`;
    }

    try {
      const data = await get(endpoint);

      setInvoiceTemplates(data?.data || []);
      setPagination(data?.pagination || {});

      if (
        data?.pagination &&
        currentPage > data.pagination.total_pages
      ) {
        setCurrentPage(1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      loadInvoiceTemplates();
    }, 400);

    return () => clearTimeout(delay);
  }, [currentPage, searchKeyword]);

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1);
  };

  const deleteTemplate = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this template?"
      )
    ) {
      return;
    }

    try {
      await del(`/v1/platform_admin/invoice_templates/${id}`);

      setInvoiceTemplates((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Unable to delete template.");
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card>
            <CNavbar expand="lg" className="bg-white">
              <CContainer fluid>
                <CNavbarBrand>
                  Invoice Templates
                </CNavbarBrand>

                <div className="d-flex justify-content-end">

                  <div className="d-flex align-items-center">

                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search Template..."
                      value={searchKeyword}
                      onChange={(e) => {
                        setCurrentPage(1);
                        setSearchKeyword(e.target.value);
                      }}
                    />

                    <button
                      className="btn btn-outline-success"
                      onClick={loadInvoiceTemplates}
                    >
                      <CIcon icon={freeSet.cilSearch} />
                    </button>

                  </div>

                  <button
                    className="btn btn-primary mx-2"
                    onClick={addTemplate}
                  >
                    Add Template
                  </button>

                </div>
              </CContainer>
            </CNavbar>

            <Card.Body className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Processor Class</th>
                    <th>Default</th>
                    <th>Created</th>
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

                    {invoiceTemplates.length > 0 ? (

                      invoiceTemplates.map((template) => (

                        <tr key={template.id}>

                          <td>{template.name}</td>

                          <td>{template.description}</td>

                          <td>{template.processor_class}</td>

                          <td>
                            {template.is_default ? (
                              <Badge bg="success">
                                Yes
                              </Badge>
                            ) : (
                              <Badge bg="secondary">
                                No
                              </Badge>
                            )}
                          </td>

                          <td>
                            {dateFormat(
                              template.created_at?.substring(0, 10)
                            )}
                          </td>

                          <td>

                            <Dropdown>

                              <Dropdown.Toggle
                                variant="light"
                                size="sm"
                              >
                                <BsThreeDots />
                              </Dropdown.Toggle>

                              <Dropdown.Menu>

                                <Dropdown.Item
                                  as={NavLink}
                                  to={`/invoice-templates/${template.id}`}
                                >
                                  Show
                                </Dropdown.Item>

                                <Dropdown.Item
                                  as={NavLink}
                                  to={`/invoice-templates/${template.id}/edit`}
                                >
                                  Edit
                                </Dropdown.Item>

                                <Dropdown.Divider />

                                <Dropdown.Item
                                  onClick={() =>
                                    deleteTemplate(template.id)
                                  }
                                >
                                  Delete
                                </Dropdown.Item>

                              </Dropdown.Menu>

                            </Dropdown>

                          </td>

                        </tr>

                      ))

                    ) : (

                      <tr>

                        <td
                          colSpan="6"
                          className="text-center"
                        >
                          No Invoice Templates Found
                        </td>

                      </tr>

                    )}

                  </tbody>
                )}
              </table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {pagination && (
        <Row className="mt-3">
          <Col className="d-flex justify-content-center">
            <Paginate
              pageCount={pagination.total_pages || 1}
              forcePage={currentPage - 1}
              onPageChange={handlePageClick}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Index;