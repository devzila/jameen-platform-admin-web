import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import useFetch from "use-http";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { format_react_select } from "services/utility_functions";
import Select from "react-select";
import defaultAvatar from "assets/img/jameen-logo.png";

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

  // ✅ Correct Roles API
  async function fetchRoles() {
    const api = await get(
      `/v1/platform_admin/companies/${companyId}/roles`
    );
    if (response.ok) {
      setRolesData(format_react_select(api.data, ["id", "name"]));
    } else {
      toast.error("Failed to load roles");
    }
  }

  // ✅ Load User Data
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

  // ✅ Submit
  async function onSubmit(data) {
    console.log("FORM DATA:", data);

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
    } else {
      if (response.status === 422 && response.data?.errors) {
        Object.entries(response.data.errors).forEach(([field, fieldErrors]) => {
          if (Array.isArray(fieldErrors) && fieldErrors.length) {
            setError(field, { type: "server", message: fieldErrors[0] });
          }
        });
      } else {
        toast.error(api?.message || "Update failed");
      }
    }
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card>
            <Card.Header>
              <Row>
                <Col md="6">
                  <Card.Title as="h4">Edit User</Card.Title>
                </Col>
                <Col md="6" className="d-flex justify-content-end">
                  <Button variant="info" onClick={handleGoBack}>
                    Go Back
                  </Button>
                </Col>
              </Row>
            </Card.Header>

            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                {/* Avatar */}
                <Row>
                  <Col md="12">
                    <Form.Group>
                      <Form.Label>Avatar</Form.Label>
                      <div className="mb-2">
                        <img
                          src={userData?.avatar_url || defaultAvatar}
                          alt={userData?.name || "User avatar"}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
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
                      <Form.Text className="text-muted">
                        Upload JPG or PNG to replace avatar.
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        {formErrors.avatar?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Name */}
                <Row>
                  <Col md="12">
                    <Form.Group>
                      <Form.Label>
                        Name{" "}
                        <small className="text-danger">
                          {formErrors?.name?.message}
                        </small>
                      </Form.Label>
                      <Form.Control
                        placeholder="Name"
                        {...register("name", { required: "Name is required" })}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Email */}
                <Row>
                  <Col md="12">
                    <Form.Group>
                      <Form.Label>
                        Email{" "}
                        <small className="text-danger">
                          {formErrors?.email?.message}
                        </small>
                      </Form.Label>
                      <Form.Control
                        placeholder="Email"
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                        })}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Role Dropdown */}
                <Row>
                  <Col md="12">
                    <Form.Group>
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
                              field.onChange(
                                selected ? Number(selected.value) : null
                              )
                            }
                            value={
                              rolesData.find(
                                (r) => r.value === field.value
                              ) || null
                            }
                          />
                        )}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Mobile */}
                <Row>
                  <Col md="12">
                    <Form.Group>
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
                  </Col>
                </Row>

                {/* Submit */}
                <Button className="mt-3" type="submit" variant="info">
                  Update
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default EditUser;