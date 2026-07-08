import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Form from "./Form";
import {
  validateInvoiceTemplate,
  hasValidationErrors,
} from "./Validation";

const Add = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    processor_class: "",
    is_default: false,
    class_level: "[]",
    instance_level: "[]",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckbox = (e) => {
    setFormData((prev) => ({
      ...prev,
      is_default: e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      processor_class: formData.processor_class.trim(),
    };

    const errors = validateInvoiceTemplate(payload);

    if (hasValidationErrors(errors)) {
      Object.values(errors).forEach((error) => toast.error(error));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/v1/platform_admin/invoice_templates",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            invoice_template: {
              ...payload,
              class_level: JSON.parse(payload.class_level),
              instance_level: JSON.parse(payload.instance_level),
            },
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Invoice Template created successfully.");
        navigate("/invoice-templates");
      } else {
        toast.error(data.errors || "Unable to create Invoice Template.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      formData={formData}
      handleChange={handleChange}
      handleCheckbox={handleCheckbox}
      handleSubmit={handleSubmit}
      loading={loading}
      buttonText={loading ? "Creating..." : "Create Invoice Template"}
      onCancel={() => navigate("/invoice-templates")}
    />
  );
};

export default Add;