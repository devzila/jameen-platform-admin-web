import React, { useEffect, useState } from "react";
import useFetch from "use-http";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { format_react_select } from "services/utility_functions";
import { Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { FormShell, AdminButton } from "components/ui";

function Add() {
  const {
    register,
    handleSubmit,
    control,
    setError,
    setValue,
    formState: { errors: formErrors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      mobile_number: "",
      role_id: null,
      avatar: null,
    },
  });

  const { companyId } = useParams();
  const { get, post, response } = useFetch();
  const [rolesData, setRolesData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
  }, []);

  async function fetchRoles() {
    const api = await get(`/v1/platform_admin/companies/${companyId}/roles`);

    if (response.ok) {
      const formattedRoles = format_react_select(api.data, ["id", "name"]);
      setRolesData(formattedRoles);

      const adminRole = formattedRoles.find(
        (role) => role.label.toLowerCase() === "admin"
      );

      if (adminRole) {
        setValue("role_id", Number(adminRole.value));
      }
    } else {
      toast.error("Failed to load roles");
    }
  }

  async function onSubmit(data) {
    if (
      !data.name ||
      !data.email ||
      !data.password ||
      !data.mobile_number ||
      !data.role_id
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const { avatar, ...userFields } = data;
    const hasAvatar =
      avatar &&
      typeof avatar.length === "number" &&
      avatar.length > 0 &&
      avatar[0] instanceof File;

    const body = hasAvatar
      ? (() => {
          const fd = new FormData();
          Object.entries(userFields).forEach(([key, value]) => {
            if (value != null && value !== "") {
              fd.append(
                `user[${key}]`,
                key === "role_id" ? Number(value) : value
              );
            }
          });
          fd.append("user[avatar]", avatar[0]);
          return fd;
        })()
      : {
          user: {
            name: userFields.name,
            email: userFields.email,
            password: userFields.password,
            mobile_number: userFields.mobile_number,
            role_id: Number(userFields.role_id),
          },
        };

    const api = await post(
      `/v1/platform_admin/companies/${companyId}/users`,
      body
    );

    if (response.ok) {
      toast.success("User added Successfully");
      navigate(`/companies/${companyId}/users`);
    } else if (response.status === 422 && response.data?.errors) {
      Object.entries(response.data.errors).forEach(([field, fieldErrors]) => {
        if (Array.isArray(fieldErrors) && fieldErrors.length) {
          setError(field, { type: "server", message: fieldErrors[0] });
        }
      });
    } else {
      toast.error(api?.message || "Invalid data");
    }
  }

  return (
    <FormShell
      title="Add User"
      subtitle="Invite a new company user with role and profile details."
      onBack={() => navigate(-1)}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-field">
          <Form.Label>Avatar</Form.Label>
          <Form.Control
            type="file"
            accept="image/jpeg,image/png,.jpg,.jpeg,.png"
            isInvalid={!!formErrors.avatar}
            {...register("avatar")}
          />
          <Form.Text>Optional. JPG or PNG.</Form.Text>
          <Form.Control.Feedback type="invalid">
            {formErrors.avatar?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-field">
          <Form.Label>
            Name{" "}
            <small className="text-danger">{formErrors?.name?.message}</small>
          </Form.Label>
          <Form.Control
            placeholder="Enter Name"
            type="text"
            {...register("name", { required: "Name is required" })}
          />
        </Form.Group>

        <Form.Group className="mb-field">
          <Form.Label>
            Email{" "}
            <small className="text-danger">{formErrors?.email?.message}</small>
          </Form.Label>
          <Form.Control
            autoComplete="off"
            placeholder="Enter Email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            })}
          />
        </Form.Group>

        <Form.Group className="mb-field">
          <Form.Label>
            Password{" "}
            <small className="text-danger">
              {formErrors?.password?.message}
            </small>
          </Form.Label>
          <Form.Control
            autoComplete="new-password"
            placeholder="Enter Password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
        </Form.Group>

        <Form.Group className="mb-field">
          <Form.Label>
            Role{" "}
            <small className="text-danger">
              {formErrors?.role_id?.message}
            </small>
          </Form.Label>
          <Controller
            name="role_id"
            control={control}
            rules={{ required: "Role is required" }}
            render={() => (
              <Select
                options={rolesData.filter(
                  (role) => role.label.toLowerCase() === "admin"
                )}
                placeholder="Select Role"
                isDisabled
                isClearable={false}
                value={
                  rolesData.find((r) => r.label.toLowerCase() === "admin") ||
                  null
                }
              />
            )}
          />
        </Form.Group>

        <Form.Group className="mb-field">
          <Form.Label>
            Mobile Number{" "}
            <small className="text-danger">
              {formErrors?.mobile_number?.message}
            </small>
          </Form.Label>
          <Form.Control
            placeholder="Enter Mobile Number"
            type="text"
            {...register("mobile_number", {
              required: "Mobile number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter valid 10 digit number",
              },
            })}
          />
        </Form.Group>

        <AdminButton type="submit">Save</AdminButton>
      </Form>
    </FormShell>
  );
}

export default Add;
