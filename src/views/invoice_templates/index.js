"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import useApi from "hooks/useApi";
import Paginate from "../../components/Paginate";
import Loader from "components/Loader";
import { BsThreeDots } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import CustomDivToggle from "components/CustomDivToggle";
import dateFormat from "../../utilities/DateFormat";
import {
  PageShell,
  PageHeader,
  ContentCard,
  SearchInput,
  AdminButton,
  DataTable,
  EmptyState,
  StatusBadge,
} from "components/ui";

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "processor", label: "Processor class" },
  { key: "category", label: "Category" },
  { key: "default", label: "Default" },
  { key: "created", label: "Created" },
  { key: "action", label: "Action" },
];

function Index() {
  const [invoiceTemplates, setInvoiceTemplates] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const { get, del, loading } = useApi();
  const router = useRouter();

  const loadInvoiceTemplates = async () => {
    let endpoint = `/v1/platform_admin/invoice_templates?page=${currentPage}`;

    if (searchKeyword.trim() !== "") {
      endpoint += `&q[name_cont]=${encodeURIComponent(searchKeyword)}`;
    }

    try {
      const response = await get(endpoint);
      const templates =
        response?.data || response?.invoice_templates || response || [];

      setInvoiceTemplates(Array.isArray(templates) ? templates : []);
      setPagination(response?.pagination || {});

      if (
        response?.pagination &&
        response.pagination.total_pages > 0 &&
        currentPage > response.pagination.total_pages
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
    }, 300);
    return () => clearTimeout(delay);
  }, [currentPage, searchKeyword]);

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template?")) {
      return;
    }

    try {
      await del(`/v1/platform_admin/invoice_templates/${id}`);
      loadInvoiceTemplates();
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
            <CNavbar
              expand="lg"
              className="bg-white"
            >
              <CContainer fluid>
                <CNavbarBrand>
                  Invoice Templates
                </CNavbarBrand>

                <div className="d-flex justify-content-end">
                  <div className="d-flex align-items-center">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search by template name..."
                      value={
                        searchKeyword
                      }
                      onChange={(e) => {
                        setCurrentPage(
                          1,
                        )
                        setSearchKeyword(
                          e.target.value,
                        )
                      }}
                    />

                    <button
                      className="btn btn-outline-success ms-2"
                      onClick={
                        loadInvoiceTemplates
                      }
                    >
                      <CIcon
                        icon={
                          freeSet.cilSearch
                        }
                      />
                    </button>
                  </div>

                  <button
                    className="btn btn-primary mx-2"
                    onClick={
                      addTemplate
                    }
                  >
                    Add Template
                  </button>
                </div>
              </CContainer>
            </CNavbar>

            <Card.Body className="table-responsive">
              <div
                style={{
                  width: '100%',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                }}
              >
              <table
                className="table table-striped align-middle mb-0"
                style={{
                  minWidth: '900px',
                  whiteSpace: 'nowrap',
                }}
              >
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>
                      Processor Class
                    </th>
                    <th>
                      Category Id
                    </th>
                    <th>
                      Default
                    </th>
                    <th>
                      Created
                    </th>
                    <th width="60">
                      Action
                    </th>
                  </tr>
                </thead>

                {loading ? (
                  <tbody>
                    <tr>
                      <td
                        colSpan="9"
                        className="text-center py-5"
                      >
                        <Loader />
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {invoiceTemplates.length >
                    0 ? (
                      invoiceTemplates.map(
                        (
                          template,
                        ) => (
                          <tr
                            key={
                              template.id
                            }
                          >
                            <td className="fw-semibold">
                              {
                                template.name
                              }
                            </td>

                            <td>
                              {template.description ||
                                '-'}
                            </td>

                            <td>
                              <small className="text-muted">
                                {
                                  template.processor_class
                                }
                              </small>
                            </td>
                            <td>
                              {template.category_name || "-"}
                            </td>
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
                              {template.created_at
                                ? dateFormat(
                                    template.created_at.substring(
                                      0,
                                      10,
                                    ),
                                  )
                                : '-'}
                            </td>

                            <td className="text-center">
                              <Dropdown align="end">
                                <Dropdown.Toggle
                                  variant="light"
                                  size="sm"
                                  className="border-0 shadow-none"
                                >
                                  <BsThreeDots
                                    size={
                                      18
                                    }
                                  />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                  <Dropdown.Item
                                    as={
                                      Link
                                    }
                                    href={`/invoice-templates/${template.id}`}
                                  >
                                    👁
                                    View
                                  </Dropdown.Item>

                                  <Dropdown.Item
                                    as={
                                      Link
                                    }
                                    href={`/invoice-templates/${template.id}/edit`}
                                  >
                                    ✏
                                    Edit
                                  </Dropdown.Item>

                                  <Dropdown.Divider />

                                  <Dropdown.Item
                                    className="text-danger"
                                    onClick={() =>
                                      handleDelete(
                                        template.id,
                                      )
                                    }
                                  >
                                    🗑
                                    Delete
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                        ),
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="9"
                          className="text-center py-5"
                        >
                          <h6 className="mb-1">
                            No Invoice
                            Templates
                            Found
                          </h6>

                          <small className="text-muted">
                            Click "Add
                            Template" to
                            create your
                            first invoice
                            template.
                          </small>
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

      {pagination?.total_pages >
        1 && (
        <Row className="mt-3">
          <Col className="d-flex justify-content-center">
            <Paginate
              pageCount={
                pagination.total_pages
              }
              forcePage={
                currentPage - 1
              }
              onPageChange={
                handlePageClick
              }
            />
            <AdminButton onClick={() => router.push("/invoice-templates/add")}>
              Add Template
            </AdminButton>
          </>
        }
      />

      <ContentCard flush>
        <DataTable
          columns={COLUMNS}
          loading={loading && !invoiceTemplates.length ? <Loader /> : null}
          colSpan={COLUMNS.length}
          empty={
            <EmptyState
              colSpan={COLUMNS.length}
              title="No invoice templates found"
              text='Click "Add Template" to create your first invoice template.'
            />
          }
        >
          {invoiceTemplates.length > 0
            ? invoiceTemplates.map((template) => (
                <tr key={template.id}>
                  <td>
                    <div className="cell-title">{template.name}</div>
                  </td>
                  <td className="cell-muted">{template.description || "-"}</td>
                  <td className="cell-muted">
                    <small>{template.processor_class || "-"}</small>
                  </td>
                  <td>{template.category_name || "-"}</td>
                  <td>
                    <StatusBadge
                      active={!!template.is_default}
                      label={template.is_default ? "Yes" : "No"}
                      tone={template.is_default ? "success" : "muted"}
                    />
                  </td>
                  <td className="cell-muted">
                    {template.created_at
                      ? dateFormat(template.created_at.substring(0, 10))
                      : "-"}
                  </td>
                  <td>
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        as={CustomDivToggle}
                        style={{ cursor: "pointer" }}
                      >
                        <BsThreeDots />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          as={Link}
                          href={`/invoice-templates/${template.id}`}
                        >
                          View
                        </Dropdown.Item>
                        <Dropdown.Item
                          as={Link}
                          href={`/invoice-templates/${template.id}/edit`}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                          className="text-danger"
                          onClick={() => handleDelete(template.id)}
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))
            : null}
        </DataTable>
      </ContentCard>

      {pagination?.total_pages > 1 ? (
        <Paginate
          pageCount={pagination.total_pages}
          forcePage={currentPage - 1}
          onPageChange={handlePageClick}
        />
      ) : null}
    </PageShell>
  );
}

export default Index;
