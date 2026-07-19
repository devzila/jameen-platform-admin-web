"use client";

import { useRouter, useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useApi from "hooks/useApi";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";
import { FormShell, AdminButton } from "components/ui";

function Edit() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm();

  const { id } = useParams();
  const { get, put, response } = useApi();
  const router = useRouter();

  useEffect(() => {
    loadSubscription();
  }, [id]);

  async function loadSubscription() {
    const api = await get(`/v1/platform_admin/subscriptions/${id}`);
    if (response.ok) {
      setValue("name", api.data.name);
      setValue("max_no_of_units", api.data.max_no_of_units);
      setValue("max_no_of_compounds", api.data.max_no_of_compounds);
    }
  }

  async function onSubmit(data) {
    await put(`/v1/platform_admin/subscriptions/${id}`, {
      subscription: data,
    });
    if (response.ok) {
      router.push("/subscriptions");
      toast.success("Subscription updated successfully");
    } else if (response.status === 422 && response.data?.errors) {
      Object.entries(response.data.errors).forEach(([field, fieldErrors]) => {
        if (Array.isArray(fieldErrors) && fieldErrors.length) {
          setError(field, { type: "server", message: fieldErrors[0] });
        }
      });
    } else {
      toast.error(response.data?.message || "Error editing subscription");
    }
  }

  return (
    <FormShell
      title="Edit Subscription"
      subtitle="Update plan name and capacity limits."
      onBack={() => router.back()}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-field">
          <Form.Label>Name</Form.Label>
          <Form.Control
            placeholder="Subscription Name"
            type="text"
            isInvalid={!!errors.name}
            {...register("name")}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-field">
          <Form.Label>Max number of units</Form.Label>
          <Form.Control
            placeholder="0"
            type="number"
            isInvalid={!!errors.max_no_of_units}
            {...register("max_no_of_units")}
          />
          <Form.Control.Feedback type="invalid">
            {errors.max_no_of_units?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-field">
          <Form.Label>Max number of compounds</Form.Label>
          <Form.Control
            placeholder="0"
            type="number"
            isInvalid={!!errors.max_no_of_compounds}
            {...register("max_no_of_compounds")}
          />
          <Form.Control.Feedback type="invalid">
            {errors.max_no_of_compounds?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <AdminButton type="submit">Update</AdminButton>
      </Form>
    </FormShell>
  );
}

export default Edit;
