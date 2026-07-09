import React, { useState, useEffect } from "react";
import useFetch from "use-http";
import Paginate from "../../components/Paginate";
import Loader from "components/Loader";
import { BsThreeDots } from "react-icons/bs";
import { Dropdown, Badge, Card, Container, Row, Col } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import {
  CNavbar,
  CContainer,
  CNavbarBrand,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import dateFormat from "../../utilities/DateFormat";
import { Link } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CBadge
} from "@coreui/react";

const Index = () => {
  const [invoiceTemplates, setInvoiceTemplates] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const { get, del, loading } = useFetch();
  const navigate = useNavigate();

  const loadInvoiceTemplates = async () => {
    let endpoint = `/v1/platform_admin/invoice_templates?page=${currentPage}`;

    if (searchKeyword.trim() !== "") {
      endpoint += `&q[name_cont]=${searchKeyword}`;
    }

    try {
      const response = await get(endpoint);

      setInvoiceTemplates(response.data || []);
      setPagination(response.pagination || {});
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadInvoiceTemplates();
  }, [currentPage, searchKeyword]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template?")) {
      return;
    }

    try {
      await del(`/v1/platform_admin/invoice_templates/${id}`);

      loadInvoiceTemplates();
    } catch (err) {
      console.error(err);
    }
  };

  const addTemplate = () => {
    navigate("/invoice-templates/add");
  };

  return (
  <Container fluid>
    <Row>
      <Col md={12}>
        <CCard className="shadow-sm border-0">
          <CCardHeader className="bg-white py-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap">

              <h4 className="fw-bold mb-0">
                Invoice Templates
              </h4>

              <div className="d-flex align-items-center">

                <input
                  type="search"
                  className="form-control me-2"
                  placeholder="Search Template..."
                  value={searchKeyword}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setSearchKeyword(e.target.value);
                  }}
                  style={{ width: "260px" }}
                />

                <CButton
                  color="primary"
                  onClick={addTemplate}
                >
                  + Add Template
                </CButton>

              </div>

            </div>
          </CCardHeader>
          <CCardBody className="table-responsive">
            <CTable
              hover
              striped
              bordered
              responsive
              className="align-middle mb-0"
            >
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Processor Class</CTableHeaderCell>
                  <CTableHeaderCell>Default</CTableHeaderCell>
                  <CTableHeaderCell>Created</CTableHeaderCell>
                  <CTableHeaderCell width="250">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

                {loading ? (
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center">
                        <Loader />
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                ) : (
                  <CTableBody>
                    {invoiceTemplates.length > 0 ? (
                      invoiceTemplates.map((template) => (
                        <CTableRow key={template.id}>
                          <CTableDataCell>{template.name}</CTableDataCell>

                          <CTableDataCell>{template.description}</CTableDataCell>

                          <CTableDataCell>
                            {template.processor_class}
                          </CTableDataCell>

                          <CTableDataCell>
                            {template.is_default ? (
                              <CBadge color="success" shape="rounded-pill">Yes</CBadge>
                            ) : (
                              <CBadge color="secondary" shape="rounded-pill">No</CBadge>
                            )}
                          </CTableDataCell>

                          <CTableDataCell>
                            {dateFormat(
                              template.created_at?.substring(0, 10)
                            )}
                          </CTableDataCell>

                          <CTableDataCell>
                            <Link to={`/invoice-templates/${template.id}`}>
                              <CButton
                                color="info"
                                variant="outline"
                                size="sm"
                                className="me-2"
                              >
                                View
                              </CButton>
                            </Link>

                            <Link to={`/invoice-templates/${template.id}/edit`}>
                              <CButton
                                color="warning"
                                variant="outline"
                                size="sm"
                                className="me-2"
                              >
                                Edit
                              </CButton>
                            </Link>

                            <CButton
                              color="danger"
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(template.id)}
                            >
                              Delete
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell
                          colSpan="6"
                          className="text-center"
                        >
                          No invoice templates available.
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                )}
            </CTable>

          {pagination.total_pages > 1 && (
          <div className="d-flex justify-content-center py-4">
            <Paginate
              pageCount={pagination.total_pages}
              forcePage={currentPage - 1}
              onPageChange={(e) => setCurrentPage(e.selected + 1)}
            />
          </div>
        )}
      </CCardBody>
    </CCard>
  </Col>
</Row>
</Container>
);
};

export default Index;