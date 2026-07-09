import React, { useEffect, useState } from "react";
import useFetch from "use-http";
import { useNavigate, useParams } from "react-router-dom";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CBadge,
  CSpinner,
} from "@coreui/react";

import dateFormat from "../../utilities/DateFormat";

const Show = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { get, loading } = useFetch();

  const [template, setTemplate] = useState(null);

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    try {
      const response = await get(
        `/v1/platform_admin/invoice_templates/${id}`
      );

      setTemplate(response.data || response);
    } catch (err) {
      console.error(err);
      alert("Unable to load Invoice Template.");
    }
  };

  if (loading || !template) {
    return (
      <CContainer className="py-5">
        <div className="text-center">
          <CSpinner color="primary" />
          <div className="mt-2">Loading...</div>
        </div>
      </CContainer>
    );
  }

  return (
    <CContainer className="py-4">
      <CRow className="justify-content-center">
        <CCol lg={8}>
          <CCard className="shadow border-0">

            <CCardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                Invoice Template Details
              </h4>

              <CButton
                color="light"
                size="sm"
                onClick={() => navigate("/invoice-templates")}
              >
                Back
              </CButton>
            </CCardHeader>

            <CCardBody className="p-4">

              <table className="table table-bordered">

                <tbody>

                  <tr>
                    <th width="30%">ID</th>
                    <td>{template.id}</td>
                  </tr>

                  <tr>
                    <th>Name</th>
                    <td>{template.name}</td>
                  </tr>

                  <tr>
                    <th>Description</th>
                    <td>
                      {template.description || "-"}
                    </td>
                  </tr>

                  <tr>
                    <th>Processor Class</th>
                    <td>{template.processor_class}</td>
                  </tr>

                  <tr>
                    <th>Default Template</th>
                    <td>
                      {template.is_default ? (
                        <CBadge color="success">
                          Yes
                        </CBadge>
                      ) : (
                        <CBadge color="secondary">
                          No
                        </CBadge>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <th>Class Level</th>
                    <td>
                      {template.class_level &&
                      template.class_level.length > 0
                        ? template.class_level.join(", ")
                        : "-"}
                    </td>
                  </tr>

                  <tr>
                    <th>Instance Level</th>
                    <td>
                      {template.instance_level &&
                      template.instance_level.length > 0
                        ? template.instance_level.join(", ")
                        : "-"}
                    </td>
                  </tr>

                  <tr>
                    <th>Created At</th>
                    <td>
                      {template.created_at
                        ? dateFormat(
                            template.created_at.substring(0, 10)
                          )
                        : "-"}
                    </td>
                  </tr>

                  <tr>
                    <th>Updated At</th>
                    <td>
                      {template.updated_at
                        ? dateFormat(
                            template.updated_at.substring(0, 10)
                          )
                        : "-"}
                    </td>
                  </tr>

                </tbody>

              </table>

              <div className="d-flex justify-content-end mt-4">

                <CButton
                  color="warning"
                  className="me-2"
                  onClick={() =>
                    navigate(
                      `/invoice-templates/${template.id}/edit`
                    )
                  }
                >
                  Edit
                </CButton>

                <CButton
                  color="secondary"
                  onClick={() =>
                    navigate("/invoice-templates")
                  }
                >
                  Back to List
                </CButton>

              </div>

            </CCardBody>

          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Show;