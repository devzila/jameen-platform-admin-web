import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import useFetch from "use-http";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { format_react_select } from "services/utility_functions";
import Select from "react-select";

function EditUser() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role_id: null,
    },
  });

  const { get, put, response } = useFetch();

  const [rolesData, setRolesData] = useState([]);
  const [userData, setUserData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);

  const navigate = useNavigate();
  const { companyId, userId } = useParams();

  useEffect(() => {
    fetchRoles();
    loadUser();
  }, [userId]);

  // FETCH ROLES
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

  // LOAD USER
  async function loadUser() {
    const api = await get(
      `/v1/platform_admin/companies/${companyId}/users/${userId}`
    );

    console.log("USER API RESPONSE:", api);

    if (response.ok) {
      setUserData(api.data || {});

      setValue("name", api.data.name);
      setValue("email", api.data.email);
      setValue("mobile_number", api.data.mobile_number);
      setValue("role_id", api.data.role?.id || null);

      // OLD AVATAR SHOW
      if (api.data.avatar_url) {
        setAvatarPreview(api.data.avatar_url);
      }
    } else {
      toast.error("Failed to load user");
    }
  }

  // SUBMIT
  async function onSubmit(data) {
    const { avatar, ...userFields } = data;

    const hasAvatar = avatar instanceof File;

    const body = hasAvatar
      ? (() => {
          const fd = new FormData();

          Object.entries(userFields).forEach(([key, value]) => {
            if (value != null && value !== "") {
              fd.append(`user[${key}]`, value);
            }
          });

          fd.append("user[avatar]", avatar);

          return fd;
        })()
      : {
          user: {
            ...userFields,
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
        Object.entries(response.data.errors).forEach(
          ([field, fieldErrors]) => {
            if (Array.isArray(fieldErrors) && fieldErrors.length) {
              setError(field, {
                type: "server",
                message: fieldErrors[0],
              });
            }
          }
        );
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
                {/* AVATAR */}
                <Row>
                  <Col md="12">
                    <Form.Group className="mb-3">
                      <Form.Label>Avatar</Form.Label>

                      {/* SHOW OLD OR NEW AVATAR */}
                      <div className="mb-3">
                        <img
                          src={
                            avatarPreview ||
                            "https://via.placeholder.com/100"
                          }
                          alt="avatar"
                          width="100"
                          height="100"
                          style={{
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "1px solid #ddd",
                          }}
                        />
                      </div>

                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];

                          if (file) {
                            setValue("avatar", file);

                            // NEW IMAGE PREVIEW
                            setAvatarPreview(
                              URL.createObjectURL(file)
                            );
                          }
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* NAME */}
                <Row>
                  <Col md="12">
                    <Form.Group>
                      <Form.Label>
                        Name{" "}
                        <small className="text-danger">
                          {errors?.name?.message}
                        </small>
                      </Form.Label>

                      <Form.Control
                        placeholder="Name"
                        {...register("name", {
                          required: "Name is required",
                        })}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* EMAIL */}
                <Row>
                  <Col md="12">
                    <Form.Group>
                      <Form.Label>
                        Email{" "}
                        <small className="text-danger">
                          {errors?.email?.message}
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

                {/* ROLE */}
                <Row>
                  <Col md="12">
                    <Form.Group>
                      <Form.Label>
                        Role{" "}
                        <small className="text-danger">
                          {errors?.role_id?.message}
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

                {/* MOBILE */}
                <Row>
                  <Col md="12">
                    <Form.Group>
                      <Form.Label>
                        Mobile Number{" "}
                        <small className="text-danger">
                          {errors?.mobile_number?.message}
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

                {/* SUBMIT */}
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