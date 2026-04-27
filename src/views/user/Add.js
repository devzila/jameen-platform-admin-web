import React, { useEffect, useState } from "react";
import useFetch from "use-http";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { format_react_select } from "services/utility_functions";

import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

function Add() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors: formErrors },
  } = useForm({
    defaultValues: {
      role_id: null,
    },
  });

  const { companyId } = useParams();
  const { get, post, response } = useFetch();

  const [rolesData, setRolesData] = useState([]);
  const [apiErrors, setApiErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
  }, []);

  // Fetch Roles
  async function fetchRoles() {
    const api = await get(`/v1/platform_admin/companies/${companyId}/roles`);
    if (response.ok) {
      setRolesData(format_react_select(api.data, ["id", "name"]));
    } else {
      toast.error("Failed to load roles");
    }
  }

  // Submit Form
  async function onSubmit(data) {
    console.log("FORM DATA:", data);

    if (
      !data.name ||
      !data.email ||
      !data.username ||
      !data.password ||
      !data.mobile_number ||
      !data.role_id
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      user: {
        name: data.name,
        email: data.email,
        username: data.username,
        password: data.password,
        mobile_number: data.mobile_number,
        role_id: Number(data.role_id),
      },
    };

    console.log("PAYLOAD:", payload);

    const api = await post(
      `/v1/platform_admin/companies/${companyId}/users`,
      payload
    );

    if (response.ok) {
      toast.success("User added Successfully");
      navigate(`/companies/${companyId}/users`);
    } else {
      console.log("API ERROR:", api);
      setApiErrors(api?.errors || {});
      toast.error(api?.message || "Invalid data");
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
                  <Card.Title as="h4">Add User</Card.Title>
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
                {/* Name */}
                <Row>
                  <Col md="12">
                    <Form.Group>
                      <Form.Label>
                        Name{" "}
                        <small className="text-danger">
                          {formErrors?.name?.message || apiErrors?.name}
                        </small>
                      </Form.Label>
                      <Form.Control
                        placeholder="Enter Name"
                        type="text"
                        {...register("name", {
                          required: "Name is required",
                        })}
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
                          {formErrors?.email?.message || apiErrors?.email}
                        </small>
                      </Form.Label>
                      <Form.Control
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
                  </Col>
                </Row>

                {/* Username */}
                <Row>
                  <Col md="12">
                    <Form.Group>
                      <Form.Label>
                        Username{" "}
                        <small className="text-danger">
                          {formErrors?.username?.message || apiErrors?.username}
                        </small>
                      </Form.Label>
                      <Form.Control
                        placeholder="Enter Username"
                        type="text"
                        {...register("username", {
                          required: "Username is required",
                        })}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Password */}
                <Row>
                  <Col md="12">
                    <Form.Group>
                      <Form.Label>
                        Password{" "}
                        <small className="text-danger">
                          {formErrors?.password?.message || apiErrors?.password}
                        </small>
                      </Form.Label>
                      <Form.Control
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
                  </Col>
                </Row>

                {/* Role */}
                <Row>
                  <Col md="12">
                    <Form.Group>
                      <Form.Label>
                        Role{" "}
                        <small className="text-danger">
                          {formErrors?.role_id?.message || apiErrors?.role_id}
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
                          {formErrors?.mobile_number?.message ||
                            apiErrors?.mobile_number}
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
                  </Col>
                </Row>

                {/* Submit */}
                <Button
                  className="btn custom_theme_button mt-3"
                  type="submit"
                  variant="info"
                >
                  Save
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Add;