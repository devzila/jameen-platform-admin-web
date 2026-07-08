import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CButton,
  CBadge,
} from "@coreui/react";

const Show = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [invoiceTemplate, setInvoiceTemplate] = useState(null);

  useEffect(() => {
    fetchInvoiceTemplate();
  }, []);

  const fetchInvoiceTemplate = async () => {
    try {
      const response = await fetch(
        `/v1/platform_admin/invoice_templates/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const data = await response.json();

      setInvoiceTemplate(data.data || data);
    } catch (err) {
      console.error(err);
      alert("Unable to fetch Invoice Template.");
    }

    setLoading(false);
  };

  if (loading) {
    return <h4>Loading...</h4>;
  }

  if (!invoiceTemplate) {
    return <h4>Invoice Template not found.</h4>;
  }

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between">
        <h4>Invoice Template Details</h4>

        <CButton
          color="secondary"
          onClick={() => navigate("/invoice-templates")}
        >
          Back
        </CButton>
      </CCardHeader>

      <CCardBody>

        <CRow className="mb-3">
          <CCol md={3}>
            <strong>Name</strong>
          </CCol>

          <CCol md={9}>
            {invoiceTemplate.name}
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={3}>
            <strong>Description</strong>
          </CCol>

          <CCol md={9}>
            {invoiceTemplate.description}
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={3}>
            <strong>Processor Class</strong>
          </CCol>

          <CCol md={9}>
            {invoiceTemplate.processor_class}
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={3}>
            <strong>Default Template</strong>
          </CCol>

          <CCol md={9}>
            {invoiceTemplate.is_default ? (
              <CBadge color="success">Yes</CBadge>
            ) : (
              <CBadge color="secondary">No</CBadge>
            )}
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={3}>
            <strong>Class Level</strong>
          </CCol>

          <CCol md={9}>
            <pre>
              {JSON.stringify(invoiceTemplate.class_level, null, 2)}
            </pre>
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={3}>
            <strong>Instance Level</strong>
          </CCol>

          <CCol md={9}>
            <pre>
              {JSON.stringify(invoiceTemplate.instance_level, null, 2)}
            </pre>
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={3}>
            <strong>Created At</strong>
          </CCol>

          <CCol md={9}>
            {invoiceTemplate.created_at}
          </CCol>
        </CRow>

        <CRow>
          <CCol md={3}>
            <strong>Updated At</strong>
          </CCol>

          <CCol md={9}>
            {invoiceTemplate.updated_at}
          </CCol>
        </CRow>

      </CCardBody>
    </CCard>
  );
};

export default Show;