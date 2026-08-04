"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import useApi from "hooks/useApi";
import InvoiceRunResultsModal from "./show";
import {
  Container,
  Card,
  Table,
  Spinner,
  Nav,
  Badge,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import {
  FaCalendarAlt,
  FaFileAlt,
  FaPen,
} from "react-icons/fa";
import "./invoiceRunHistory.css";

function InvoiceRunHistory() {
  const { get, loading } = useApi();

  const [runs, setRuns] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] =
    useState("");
  const [selectedRun, setSelectedRun] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [selectedCompany]);

  const fetchCompanies = async () => {
    const response = await get(
      "/v1/platform_admin/companies?status=active"
    );

    if (response?.data) {
      setCompanies(response.data);
    }
  };

  const fetchHistory = async () => {
    let endpoint =
      "/v1/platform_admin/invoice_generation_runs/scheduled_run_history";

    if (selectedCompany) {
      endpoint += `?company_id=${selectedCompany}`;
    }

    const response = await get(endpoint);

    if (response?.data) {
      setRuns(response.data);
    }
  };

  return (
    <Container fluid className="admin-page">
      <Row>
        <Col md="12">
          <Card className="admin-card border-0">
            {/* NAVBAR */}
            <Nav className="invoice-tabs">
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  href="/invoice-run-history"
                >
                  <FaCalendarAlt className="mr-2" />
                  Scheduled Invoice Run
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link
                  as={Link}
                  href="/templated-invoice-run-history"
                >
                  <FaFileAlt className="mr-2" />
                  Templated Invoice Run
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link
                  as={Link}
                  href="/custom-invoice-run-history"
                >
                  <FaPen className="mr-2" />
                  Custom Invoice Run
                </Nav.Link>
              </Nav.Item>
            </Nav>

            {/* HEADER */}
            <Card.Header>
              <Row className="align-items-center">
                <Col md="6">
                  <Card.Title as="h4" className="mb-1">
                    Scheduled Invoice Run
                  </Card.Title>

                  <p className="card-category mb-0" style={{ color: 'var(--admin-text-muted)' }}>
                    {runs.length} total records
                  </p>
                </Col>

                <Col
                  md="6"
                  className="text-right"
                >
                  <Form.Group
                    className="company-filter admin-field mb-0"
                  >
                    <Form.Control
                      as="select"
                      value={selectedCompany}
                      onChange={(e) =>
                        setSelectedCompany(
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        All Companies
                      </option>

                      {companies.map(
                        (company) => (
                          <option
                            key={company.id}
                            value={company.id}
                          >
                            {company.name}
                          </option>
                        )
                      )}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Header>

            {/* TABLE */}
            <Card.Body>
              {loading ? (
                <div className="text-center p-5">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div className="table-responsive-custom">
                  <Table
                    striped
                    hover
                    className="mb-0"
                  >
                    <thead>
                      <tr>
                        <th>PROPERTY</th>
                        <th>STARTED AT</th>
                        <th>FINISHED AT</th>
                        <th>STATUS</th>
                        <th>PROCESSED</th>
                        <th>SUCCESS</th>
                        <th>FAILURE</th>
                        <th>BILLING FROM</th>
                        <th>BILLING TO</th>
                        <th>NEXT RUN</th>
                      </tr>
                    </thead>

                    <tbody>
                      {runs.length > 0 ? (
                        runs.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={() => setSelectedRun(item)}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    setSelectedRun(item);
                                  }
                                }}
                                style={{
                                  color: "#00bfcc",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  display: "inline-block",
                                  lineHeight: 1.4,
                                  transition: "text-decoration 0.15s ease",
                                }}
                                onMouseEnter={(event) => {
                                  event.currentTarget.style.textDecoration = "underline";
                                }}
                                onMouseLeave={(event) => {
                                  event.currentTarget.style.textDecoration = "none";
                                }}
                              >
                                {item?.property?.name}
                              </span>
                            </td>

                            <td>
                              {
                                item.started_at
                              }
                            </td>

                            <td>
                              {
                                item.finished_at
                              }
                            </td>

                            <td>
                              <Badge
                                variant={
                                  item.status ===
                                  "completed"
                                    ? "success"
                                    : "danger"
                                }
                              >
                                {
                                  item.status
                                }
                              </Badge>
                            </td>

                            <td>
                              {item.contracts_processed ||
                                0}
                            </td>

                            <td>
                              {item.success_count ||
                                0}
                            </td>

                            <td>
                              {item.failure_count ||
                                0}
                            </td>

                            <td>
                              {
                                item.billing_period_from
                              }
                            </td>

                            <td>
                              {
                                item.billing_period_to
                              }
                            </td>

                            <td>
                              {
                                item.next_run_date
                              }
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="10"
                            className="text-center py-4"
                          >
                            No Invoice Run History
                            Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {selectedRun && (
        <InvoiceRunResultsModal
          run={selectedRun}
          resultsEndpoint="/v1/platform_admin/invoice_generation_runs"
          onClose={() => setSelectedRun(null)}
        />
      )}
    </Container>
  );
}

export default InvoiceRunHistory;