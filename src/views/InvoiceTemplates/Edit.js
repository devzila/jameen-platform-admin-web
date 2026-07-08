import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "./Form";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    processor_class: "",
    is_default: false,
    class_level: "[]",
    instance_level: "[]",
  });

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

      const template = data.data || data;

      setFormData({
        name: template.name || "",
        description: template.description || "",
        processor_class: template.processor_class || "",
        is_default: template.is_default || false,
        class_level: JSON.stringify(
          template.class_level || [],
          null,
          2
        ),
        instance_level: JSON.stringify(
          template.instance_level || [],
          null,
          2
        ),
      });
    } catch (err) {
      console.log(err);
      alert("Unable to fetch template.");
    }

    setPageLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckbox = (e) => {
    setFormData({
      ...formData,
      is_default: e.target.checked,
    });
  };

  const validateJSON = (value) => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateJSON(formData.class_level)) {
      return alert("Invalid Class Level JSON");
    }

    if (!validateJSON(formData.instance_level)) {
      return alert("Invalid Instance Level JSON");
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/v1/platform_admin/invoice_templates/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            invoice_template: {
              ...formData,
              class_level: JSON.parse(formData.class_level),
              instance_level: JSON.parse(formData.instance_level),
            },
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Invoice Template Updated Successfully");
        navigate("/invoice-templates");
      } else {
        alert(data.errors || "Update Failed");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  if (pageLoading) {
    return <h4>Loading...</h4>;
  }

  return (
    <Form
      formData={formData}
      handleChange={handleChange}
      handleCheckbox={handleCheckbox}
      handleSubmit={handleSubmit}
      loading={loading}
      buttonText="Update"
    />
  );
};

export default Edit;