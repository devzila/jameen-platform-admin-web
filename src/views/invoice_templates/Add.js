import React, { useState } from "react";
import useFetch from "use-http";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Container,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import {
  CNavbar,
  CContainer,
  CNavbarBrand,
} from "@coreui/react";

function Add() {
  const navigate = useNavigate();

  const { post, loading } = useFetch();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    processor_class: "",
    is_default: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = () => {
    let validationErrors = {};

    if (!formData.name.trim()) {
      validationErrors.name = "Name is required";
    }

    if (!formData.description.trim()) {
      validationErrors.description = "Description is required";
    }

    if (!formData.processor_class.trim()) {
      validationErrors.processor_class =
        "Processor Class is required";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await post("/v1/platform_admin/invoice_templates", {
        invoice_template: formData,
      });

      navigate("/invoice-templates");
    } catch (err) {
      console.error(err);
      alert("Unable to create invoice template.");
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={8}>
          <Card>
            <CNavbar className="bg-white">
              <CContainer fluid>
                <CNavbarBrand>Add Invoice Template</CNavbarBrand>
              </CContainer>
            </CNavbar>

            <Card.Body>

              <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>

                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter template name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>

                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={handleChange}
                    isInvalid={!!errors.description}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>

                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Processor Class *</Form.Label>

                  <Form.Control
                    type="text"
                    name="processor_class"
                    placeholder="InvoiceProcessors::RentInvoice"
                    value={formData.processor_class}
                    onChange={handleChange}
                    isInvalid={!!errors.processor_class}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.processor_class}
                  </Form.Control.Feedback>

                </Form.Group>

                <Form.Group className="mb-4">

                  <Form.Check
                    type="checkbox"
                    label="Set as Default Template"
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleChange}
                  />

                </Form.Group>

                <div className="d-flex">

                  <Button
                    variant="secondary"
                    className="me-2"
                    onClick={() => navigate("/invoice-templates")}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Add Template"}
                  </Button>

                </div>

              </Form>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Add;