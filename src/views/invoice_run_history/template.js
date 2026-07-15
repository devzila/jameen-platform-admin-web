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

function TemplatedInvoiceRunHistory() {
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
          <div className="d-flex align-items-center">
            <div className="ms-3">
              <h4 className="mb-1 fw-bold">
                Template Invoice Run
              </h4>
            </div>
          </div>

          <div className="text-center py-5 text-muted">
            No Template Invoice Run History Found
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default TemplatedInvoiceRunHistory;

