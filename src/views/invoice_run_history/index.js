import React, { useEffect, useState } from "react";
import useFetch from "use-http";
import {
  Container,
  Card,
  Table,
  Spinner,
  Nav,
  Badge,
} from "react-bootstrap";
import {
  FaCalendarAlt,
  FaFileAlt,
  FaPen,
  FaHistory,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./invoiceRunHistory.css";

function InvoiceRunHistory() {
  const { get, loading } = useFetch();

  const [runs, setRuns] = useState([]);
  const [companies, setCompanies] =
    useState([]);
  const [
  selectedCompany,
  setSelectedCompany,
  ] = useState(null);

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

    if(response?.data){
      setCompanies(response.data);

      if(response.data.length){
        setSelectedCompany(response.data[0].id);
      }
    }
  };

  const fetchHistory = async () => {
    let endpoint =
      "/v1/platform_admin/invoice_generation_runs/scheduled_run_history";

    if (selectedCompany) {
      endpoint += `?company_id=${selectedCompany}`;
    }

    const response =
      await get(endpoint);

    if (response?.data) {
      setRuns(response.data);
    }
  };

  return (
    <Container fluid className="mt-4">
      <Card className="invoice-history-card">

        {/* NAVBAR */}

        <Nav className="invoice-tabs">
          <Nav.Item>
            <Nav.Link
              as={NavLink}
              to="/invoice-run-history"
            >
              <FaCalendarAlt className="me-2" />
              Scheduled Invoice Run
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              as={NavLink}
              to="/templated-invoice-run-history"
            >
              <FaFileAlt className="me-2" />
              Templated Invoice Run
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              as={NavLink}
              to="/custom-invoice-run-history"
            >
              <FaPen className="me-2" />
              Custom Invoice Run
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Card.Body className="p-4">

          {/* HEADER */}

          <div className="invoice-header mb-4">
            <div className="d-flex align-items-center">
              <div className="invoice-icon-box">
                <FaHistory />
              </div>

              <div className="ms-3">
                <h4 className="mb-1 fw-bold">
                  Scheduled Invoice Run
                </h4>

                <div className="total-text">
                  {runs.length} total records
                </div>
              </div>
            </div>

            {/* COMPANY FILTER */}

            <div className="company-filter">
              <label className="company-label">
                Company
              </label>

              <select
                className="form-select form-select-sm"
                value={
                  selectedCompany
                }
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
                      value={
                        company.id
                      }
                    >
                      {company.name}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* TABLE */}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <div className="invoice-table-wrapper">
              <Table
                className="invoice-table"
                bordered
                hover
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
                          <div className="invoice-property">
                            {
                              item
                                ?.property
                                ?.name
                            }
                          </div>
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
                            className={
                              item.status ===
                              "completed"
                                ? "status-badge success"
                                : "status-badge failed"
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
                        colSpan={
                          10
                        }
                        className="text-center py-5"
                      >
                        No Invoice Run History Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              <div className="loaded-text">
                All {runs.length} items
                loaded
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default InvoiceRunHistory;

