import React, { useState } from "react";
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
  const [invoiceTemplates, setInvoiceTemplates] = useState([
    {
      id: 1,
      name: "Rent Invoice",
      description: "Default rent invoice template",
      processor_class: "InvoiceProcessors::RentInvoice",
      is_default: true
    },
    {
      id: 2,
      name: "Due Reminder",
      description: "Reminder template",
      processor_class: "InvoiceProcessors::DueReminder",
      is_default: false
    }
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      setInvoiceTemplates(
        invoiceTemplates.filter((item) => item.id !== id)
      );
    }
  };

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Invoice Templates</h4>

        <Link to="/invoice-templates/add">
          <CButton color="primary">
            + Add Invoice Template
          </CButton>
        </Link>
      </CCardHeader>

      <CCardBody>
        <CTable striped hover responsive>

          <CTableHead>

            <CTableRow>

              <CTableHeaderCell>Name</CTableHeaderCell>

              <CTableHeaderCell>Description</CTableHeaderCell>

              <CTableHeaderCell>Processor Class</CTableHeaderCell>

              <CTableHeaderCell>Default</CTableHeaderCell>

              <CTableHeaderCell width="250">
                Actions
              </CTableHeaderCell>

            </CTableRow>

          </CTableHead>

          <CTableBody>

            {invoiceTemplates.map((template) => (

              <CTableRow key={template.id}>

                <CTableDataCell>
                  {template.name}
                </CTableDataCell>

                <CTableDataCell>
                  {template.description}
                </CTableDataCell>

                <CTableDataCell>
                  {template.processor_class}
                </CTableDataCell>

                <CTableDataCell>

                  {template.is_default ? (
                    <CBadge color="success">
                      Yes
                    </CBadge>
                  ) : (
                    <CBadge color="secondary">
                      No
                    </CBadge>
                  )}

                </CTableDataCell>

                <CTableDataCell>

                  <Link to={`/invoice-templates/${template.id}`}>
                    <CButton
                      color="info"
                      size="sm"
                      className="me-2"
                    >
                      View
                    </CButton>
                  </Link>

                  <Link to={`/invoice-templates/${template.id}/edit`}>
                    <CButton
                      color="warning"
                      size="sm"
                      className="me-2"
                    >
                      Edit
                    </CButton>
                  </Link>

                  <CButton
                    color="danger"
                    size="sm"
                    onClick={() => handleDelete(template.id)}
                  >
                    Delete
                  </CButton>

                </CTableDataCell>

              </CTableRow>

            ))}

          </CTableBody>

        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default Index;