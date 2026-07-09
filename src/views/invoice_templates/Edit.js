import React, { useEffect, useState } from "react";
import useFetch from "use-http";
import { useNavigate, useParams } from "react-router-dom";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormCheck,
  CFormSelect,
  CRow,
  CCol,
  CContainer,
  CSpinner,
} from "@coreui/react";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { get, put, loading } = useFetch();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    processor_class: "",
    is_default: false,
  });

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    try {
      const response = await get(
        `/v1/platform_admin/invoice_templates/${id}`
      );

      const template = response.data || response;

      setFormData({
        name: template.name || "",
        description: template.description || "",
        processor_class: template.processor_class || "",
        is_default: template.is_default || false,
      });
    } catch (err) {
      console.error(err);
      alert("Unable to load invoice template.");
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await put(`/v1/platform_admin/invoice_templates/${id}`, {
        invoice_template: formData,
      });

      alert("Invoice Template updated successfully.");

      navigate("/invoice-templates");
    } catch (err) {
      console.error(err);
      alert("Unable to update invoice template.");
    }
  };

  return (
    <CContainer className="py-4">
      <CRow className="justify-content-center">
        <CCol lg={8} md={10}>
          <CCard className="shadow border-0">

            <CCardHeader className="bg-primary text-white py-3">
              <h4 className="mb-0">
                Edit Invoice Template
              </h4>
            </CCardHeader>

            <CCardBody className="p-4">

              <CForm onSubmit={handleSubmit}>

                <CRow className="g-4">

                  <CCol md={6}>
                    <label className="form-label fw-bold">
                      Template Name <span className="text-danger">*</span>
                    </label>

                    <CFormInput
                      name="name"
                      placeholder="Enter template name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </CCol>

                  <CCol md={6}>
                    <label className="form-label fw-bold">
                      Processor Class <span className="text-danger">*</span>
                    </label>

                    <CFormSelect
                      name="processor_class"
                      value={formData.processor_class}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select Processor Class
                      </option>

                      <option value="InvoiceProcessors::RentInvoice">
                        Rent Invoice
                      </option>

                      <option value="InvoiceProcessors::DueReminder">
                        Due Reminder
                      </option>
                    </CFormSelect>
                  </CCol>

                  <CCol md={12}>
                    <label className="form-label fw-bold">
                      Description
                    </label>

                    <CFormTextarea
                      rows={5}
                      name="description"
                      placeholder="Enter description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </CCol>

                  <CCol md={12}>
                    <CFormCheck
                      id="default-template"
                      label="Set as Default Template"
                      name="is_default"
                      checked={formData.is_default}
                      onChange={handleChange}
                    />
                  </CCol>

                </CRow>

                <hr className="my-4" />

                <div className="d-flex justify-content-end">

                  <CButton
                    color="secondary"
                    variant="outline"
                    className="me-2 px-4"
                    onClick={() =>
                      navigate("/invoice-templates")
                    }
                  >
                    Cancel
                  </CButton>

                  <CButton
                    color="primary"
                    type="submit"
                    className="px-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <CSpinner
                          size="sm"
                          className="me-2"
                        />
                        Updating...
                      </>
                    ) : (
                      "Update Template"
                    )}
                  </CButton>

                </div>

              </CForm>

            </CCardBody>

          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Edit;