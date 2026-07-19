import React from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "use-http";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";
import { FormShell, AdminButton } from "components/ui";

function Add() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const { post, response } = useFetch();
  const navigate = useNavigate();

  async function onSubmit(data) {
    await post(`/v1/platform_admin/subscriptions`, {
      subscription: data,
    });
    if (response.ok) {
      navigate("/subscriptions");
      toast.success("Successfully Created");
    } else if (response.status === 422 && response.data?.errors) {
      Object.entries(response.data.errors).forEach(([field, fieldErrors]) => {
        if (Array.isArray(fieldErrors) && fieldErrors.length) {
          setError(field, { type: "server", message: fieldErrors[0] });
        }
      });
    } else {
      toast.error(response.data?.message);
    }
  }

  return (
    <FormShell
      title="Add Subscription"
      subtitle="Create a plan with unit and compound limits."
      onBack={() => navigate(-1)}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-field">
          <Form.Label>Name</Form.Label>
          <Form.Control
            placeholder="Subscription name"
            type="text"
            isInvalid={!!errors.name}
            {...register("name")}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-field">
          <Form.Label>Max units</Form.Label>
          <Form.Control
            placeholder="Units"
            type="number"
            isInvalid={!!errors.max_no_of_units}
            {...register("max_no_of_units")}
          />
          <Form.Control.Feedback type="invalid">
            {errors.max_no_of_units?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-field">
          <Form.Label>Max compounds</Form.Label>
          <Form.Control
            placeholder="Compounds"
            type="number"
            isInvalid={!!errors.max_no_of_compounds}
            {...register("max_no_of_compounds")}
          />
          <Form.Control.Feedback type="invalid">
            {errors.max_no_of_compounds?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <AdminButton type="submit">Save</AdminButton>
      </Form>
    </FormShell>
  );
}

export default Add;
