"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import useApi from "hooks/useApi";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { FormShell, AdminButton } from "components/ui";

function Add() {
  const router = useRouter();
  const { post, get, response, loading } = useApi();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    processor_class: "",
    category_id: "",
    class_level: "{\n\n}",
    instance_level: "{\n\n}",
    is_default: false,
  });

  const [errors, setErrors] = useState({});
  const [jsonErrors, setJsonErrors] = useState({
    class_level: "",
    instance_level: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCategories = async () => {
    const api = await get("/v1/platform_admin/invoice_categories");
    if (response.ok) {
      setCategories(api.data || api || []);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "class_level" || name === "instance_level") {
      validateJsonField(name, value);
    }
  };

  const validateJsonField = (name, value) => {
    try {
      JSON.parse(value || "{}");
      setJsonErrors((prev) => ({ ...prev, [name]: "" }));
      return true;
    } catch {
      setJsonErrors((prev) => ({
        ...prev,
        [name]: "Invalid JSON format",
      }));
      return false;
    }
  };

  const validate = () => {
    const validationErrors = {};

    if (!formData.name.trim()) {
      validationErrors.name = "Template Name is required";
    }
    if (!formData.description.trim()) {
      validationErrors.description = "Description is required";
    }
    if (!formData.processor_class.trim()) {
      validationErrors.processor_class = "Processor Class is required";
    }
    if (!formData.category_id) {
      validationErrors.category_id = "Category is required";
    }
    if (!validateJsonField("class_level", formData.class_level)) {
      validationErrors.class_level = "Invalid JSON format";
    }
    if (!validateJsonField("instance_level", formData.instance_level)) {
      validationErrors.instance_level = "Invalid JSON format";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      invoice_template: {
        name: formData.name,
        description: formData.description,
        processor_class: formData.processor_class,
        category_id: Number(formData.category_id),
        is_default: formData.is_default,
        class_level: JSON.parse(formData.class_level || "{}"),
        instance_level: JSON.parse(formData.instance_level || "{}"),
      },
    };

    const api = await post("/v1/platform_admin/invoice_templates", payload);

    if (response.ok) {
      toast.success("Invoice Template Created Successfully");
      router.push("/invoice-templates");
    } else {
      toast.error(api?.message || "Unable to create template");
    }
  };

  return (
    <FormShell
      title="Add Invoice Template"
      subtitle="Create a reusable template for invoice generation."
      onBack={() => router.push("/invoice-templates")}
      maxWidth={false}
    >
      <Form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <Form.Group className="mb-field">
              <Form.Label>Template Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
                placeholder="Enter template name"
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group className="mb-field">
              <Form.Label>Processor Class</Form.Label>
              <Form.Control
                name="processor_class"
                value={formData.processor_class}
                onChange={handleChange}
                isInvalid={!!errors.processor_class}
                placeholder="InvoiceProcessors::DueReminder"
              />
              <Form.Control.Feedback type="invalid">
                {errors.processor_class}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Form.Group className="mb-field">
              <Form.Label>Invoice Category</Form.Label>
              <Form.Control
                as="select"
                name="category_id"
                value={formData.category_id || ""}
                onChange={handleChange}
                isInvalid={!!errors.category_id}
              >
                <option value="">Select Invoice Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.category_id}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group className="mb-field">
              <Form.Label>Default template</Form.Label>
              <Form.Check
                type="checkbox"
                id="is_default"
                name="is_default"
                checked={formData.is_default}
                onChange={handleChange}
                label="Mark this template as default"
              />
            </Form.Group>
          </div>
        </div>

        <Form.Group className="mb-field">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            isInvalid={!!errors.description}
          />
          <Form.Control.Feedback type="invalid">
            {errors.description}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-field">
          <Form.Label>Class Level JSON</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            name="class_level"
            value={formData.class_level}
            onChange={handleChange}
            isInvalid={!!jsonErrors.class_level}
            style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: 13 }}
          />
          <Form.Control.Feedback type="invalid">
            {jsonErrors.class_level}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-field">
          <Form.Label>Instance Level JSON</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            name="instance_level"
            value={formData.instance_level}
            onChange={handleChange}
            isInvalid={!!jsonErrors.instance_level}
            style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: 13 }}
          />
          <Form.Control.Feedback type="invalid">
            {jsonErrors.instance_level}
          </Form.Control.Feedback>
        </Form.Group>

        <AdminButton type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Invoice Template"}
        </AdminButton>
      </Form>
    </FormShell>
  );
}

export default Add;
