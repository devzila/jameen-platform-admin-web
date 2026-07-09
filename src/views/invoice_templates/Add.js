import React, { useState } from "react";
import useFetch from "use-http";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
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
    class_level: [],
    instance_level: [],
    is_default: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "class_level" || name === "instance_level") {
      setFormData({
        ...formData,
        [name]: value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const validate = () => {
    let validationErrors = {};

    if (!formData.name.trim()) {
      validationErrors.name = "Template Name is required";
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

      alert("Invoice Template Created Successfully");

      navigate("/invoice-templates");
    } catch (err) {
      console.error(err);
      alert("Unable to create template.");
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col lg={9}>
          <Card className="shadow border-0">

            <CNavbar className="bg-white border-bottom">
              <CContainer fluid>
                <CNavbarBrand className="fw-bold fs-4">
                  Add Invoice Template
                </CNavbarBrand>
              </CContainer>
            </CNavbar>

            <Card.Body className="p-4">

              <Form onSubmit={handleSubmit}>

                <Row>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Template Name <span className="text-danger">*</span>
                      </Form.Label>

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
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Processor Class <span className="text-danger">*</span>
                      </Form.Label>

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
                  </Col>

                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Description <span className="text-danger">*</span>
                  </Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={4}
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

                <Row>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Class Level
                      </Form.Label>

                      <Form.Control
                        type="text"
                        name="class_level"
                        placeholder="company, property, invoice"
                        value={formData.class_level.join(", ")}
                        onChange={handleChange}
                      />

                      <Form.Text className="text-muted">
                        Enter multiple values separated by commas.
                      </Form.Text>

                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Instance Level
                      </Form.Label>

                      <Form.Control
                        type="text"
                        name="instance_level"
                        placeholder="contract, invoice"
                        value={formData.instance_level.join(", ")}
                        onChange={handleChange}
                      />

                      <Form.Text className="text-muted">
                        Enter multiple values separated by commas.
                      </Form.Text>

                    </Form.Group>
                  </Col>

                </Row>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="switch"
                    id="default-template"
                    label="Set as Default Template"
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-flex justify-content-end">

                  <Button
                    variant="secondary"
                    className="me-2 px-4"
                    onClick={() => navigate("/invoice-templates")}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="px-4"
                  >
                    {loading ? "Saving..." : "Save Template"}
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