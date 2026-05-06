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
    formState: { errors: formErrors },
  } = useForm({
    defaultValues: {
      role_id: null,
    },
  });

  const { get, put, response } = useFetch();
  const [rolesData, setRolesData] = useState([]);
  const [apiErrors, setApiErrors] = useState({});

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

    const payload = {
      user: {
        name: data.name,
        email: data.email,
        mobile_number: data.mobile_number,
        role_id: Number(data.role_id),
      },
    };

    const api = await put(
      `/v1/platform_admin/companies/${companyId}/users/${userId}`,
      payload
    );

    if (response.ok) {
      toast.success("User updated successfully");
      navigate(`/companies/${companyId}/users`);
    } else {
      console.log("API ERROR:", api);
      setApiErrors(api?.errors || {});
      toast.error(api?.message || "Update failed");
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
                          {formErrors?.email?.message || apiErrors?.email}
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
                          {formErrors?.role_id?.message ||
                            apiErrors?.role_id}
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