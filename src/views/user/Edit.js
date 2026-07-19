import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import useFetch from "use-http";
import { Form } from "react-bootstrap";
import { format_react_select } from "services/utility_functions";
import Select from "react-select";
import defaultAvatar from "assets/img/jameen-logo.png";
import { FormShell, AdminButton } from "components/ui";

function EditUser() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    formState: { errors: formErrors },
  } = useForm({
    defaultValues: {
      role_id: null,
    },
  });

  const { get, put, response } = useFetch();
  const [rolesData, setRolesData] = useState([]);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const { companyId, userId } = useParams();

  useEffect(() => {
    fetchRoles();
    loadUser();
  }, [userId]);

  async function fetchRoles() {
    const api = await get(`/v1/platform_admin/companies/${companyId}/roles`);
    if (response.ok) {
      setRolesData(format_react_select(api.data, ["id", "name"]));
    } else {
      toast.error("Failed to load roles");
    }
  }

  async function loadUser() {
    const api = await get(
      `/v1/platform_admin/companies/${companyId}/users/${userId}`
    );
    if (response.ok) {
      setUserData(api.data || {});
      setValue("name", api.data.name);
      setValue("email", api.data.email);
      setValue("mobile_number", api.data.mobile_number);
      setValue("role_id", api.data.role?.id || null);
    } else {
      toast.error("Failed to load user");
    }
  }

  async function onSubmit(data) {
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
            mobile_number: userFields.mobile_number,
            role_id: Number(userFields.role_id),
          },
        };

    const api = await put(
      `/v1/platform_admin/companies/${companyId}/users/${userId}`,
      body
    );

    if (response.ok) {
      toast.success("User updated successfully");
      navigate(`/companies/${companyId}/users`);
    } else if (response.status === 422 && response.data?.errors) {
      Object.entries(response.data.errors).forEach(([field, fieldErrors]) => {
        if (Array.isArray(fieldErrors) && fieldErrors.length) {
          setError(field, { type: "server", message: fieldErrors[0] });
        }
      });
    } else {
      toast.error(api?.message || "Update failed");
    }
  }

  return (
    <FormShell
      title="Edit User"
      subtitle="Update profile details and replace the avatar if needed."
      onBack={() => navigate(-1)}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-field">
          <Form.Label>Avatar</Form.Label>
          <div className="admin-form-preview">
            <img
              className="is-round"
              src={userData?.avatar_url || defaultAvatar}
              alt={userData?.name || "User avatar"}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultAvatar;
              }}
            />
          </div>
          <Form.Control
            type="file"
            accept="image/jpeg,image/png,.jpg,.jpeg,.png"
            isInvalid={!!formErrors.avatar}
            {...register("avatar")}
          />
          <Form.Text>Upload JPG or PNG to replace avatar.</Form.Text>
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
            placeholder="Name"
            {...register("name", { required: "Name is required" })}
          />
        </Form.Group>

        <Form.Group className="mb-field">
          <Form.Label>
            Email{" "}
            <small className="text-danger">{formErrors?.email?.message}</small>
          </Form.Label>
          <Form.Control
            placeholder="Email"
            type="email"
            {...register("email", { required: "Email is required" })}
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
            render={({ field }) => (
              <Select
                options={rolesData}
                placeholder="Select Role"
                isClearable
                onChange={(selected) =>
                  field.onChange(selected ? Number(selected.value) : null)
                }
                value={
                  rolesData.find((r) => r.value === field.value) || null
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
            placeholder="Mobile Number"
            {...register("mobile_number", {
              required: "Mobile number is required",
            })}
          />
        </Form.Group>

        <AdminButton type="submit">Update</AdminButton>
      </Form>
    </FormShell>
  );
}

export default EditUser;
