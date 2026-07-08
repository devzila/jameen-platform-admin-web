import React from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
} from "@coreui/react";

const Form = ({
  formData,
  handleChange,
  handleCheckbox,
  handleSubmit,
  loading,
  buttonText,
  onCancel,
}) => {
  return (
    <CCard className="shadow-sm border-0">
      <CCardHeader className="bg-white py-3">
        <h4 className="mb-0">{buttonText} Invoice Template</h4>
        <small className="text-muted">
          Fill in the required information to create or update an invoice
          template.
        </small>
      </CCardHeader>

      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          {/* Basic Information */}
          <h5 className="mb-3">Basic Information</h5>

          <CRow>
            <CCol md={6}>
              <div className="mb-4">
                <CFormLabel>
                  Template Name <span className="text-danger">*</span>
                </CFormLabel>

                <CFormInput
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rent Invoice"
                  autoComplete="off"
                  required
                />
              </div>
            </CCol>

            <CCol md={6}>
              <div className="mb-4">
                <CFormLabel>
                  Processor Class <span className="text-danger">*</span>
                </CFormLabel>

                <CFormInput
                  type="text"
                  name="processor_class"
                  value={formData.processor_class}
                  onChange={handleChange}
                  placeholder="InvoiceProcessors::RentInvoice"
                  autoComplete="off"
                  required
                />
              </div>
            </CCol>
          </CRow>

          <div className="mb-4">
            <CFormLabel>Description</CFormLabel>

            <CFormTextarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a short description for this template..."
            />
          </div>

          <hr className="my-4" />

          {/* Configuration */}
          <h5 className="mb-3">Configuration</h5>

          <div className="mb-4">
            <CFormLabel>Class Level (JSON)</CFormLabel>

            <CFormTextarea
              rows={6}
              name="class_level"
              value={formData.class_level}
              onChange={handleChange}
              placeholder='[{"key":"value"}]'
              spellCheck={false}
            />

            <small className="text-muted">
              Enter a valid JSON array.
            </small>
          </div>

          <div className="mb-4">
            <CFormLabel>Instance Level (JSON)</CFormLabel>

            <CFormTextarea
              rows={6}
              name="instance_level"
              value={formData.instance_level}
              onChange={handleChange}
              placeholder='[{"key":"value"}]'
              spellCheck={false}
            />

            <small className="text-muted">
              Enter a valid JSON array.
            </small>
          </div>

          <div className="mb-4">
            <CFormCheck
              id="is_default"
              name="is_default"
              checked={formData.is_default}
              onChange={handleCheckbox}
              label="Set as Default Invoice Template"
            />
          </div>

          <hr className="my-4" />

          {/* Buttons */}
          <div className="d-flex justify-content-end">
            <CButton
              color="secondary"
              type="button"
              className="me-2"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </CButton>

            <CButton
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : buttonText}
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default Form;