import React from "react";
import {
  Container,
  Card,
  Nav,
} from "react-bootstrap";
import {
  FaCalendarAlt,
  FaFileAlt,
  FaPen,
  FaHistory,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./invoiceRunHistory.css";

function CustomInvoiceRunHistory() {
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

          <div className="d-flex align-items-center mb-4">
            <div className="ms-3">
              <h4 className="mb-1 fw-bold">
                Custom Invoice Run
              </h4>
            </div>
          </div>

          {/* EMPTY STATE */}

          <div className="text-center py-5">
            <h6 className="text-muted mb-2">
              No Custom Invoice Run History Found
            </h6>
          </div>

        </Card.Body>
      </Card>
    </Container>
  );
}

export default CustomInvoiceRunHistory;

