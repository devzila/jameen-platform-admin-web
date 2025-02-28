import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useFetch from "use-http";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

function EditUser() {
  const { register, handleSubmit, setValue } = useForm();

  const { get, put, response } = useFetch();
  const [userData, setUserData] = useState({});
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const { companyId, userId } = useParams();
  useEffect(() => {
    loadUser();
  }, [userId]);

  async function loadUser() {
    const api = await get(
      `/v1/platform_admin/companies/${companyId}/users/${userId}`
    );
    if (response.ok) {
      setValue("name", api.data.name);
      setValue("email", api.data.email);
      setValue("mobile_number", api.data.mobile_number);
      setValue("username", api.data.username);
      setValue("password", api.data.password);
      setValue("role_id", api.data.role.id);

      setUserData(api.data);
    }
  }
  async function onSubmit(data) {
    const api = await put(
      `/v1/platform_admin/companies/${companyId}/users/${userId}`,
      {
        user: data,
      }
    );
    if (response.ok) {
      navigate(`/companies/${companyId}/users`);
      toast.success("User added Successfully");
    } else {
      setErrors(api.errors);
      toast.error(response.data?.message);
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
                <Col md="6" className="text-right">
                  <Button variant="info" onClick={handleGoBack}>
                    Go Back
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col className="pr-1" md="12">
                    <Form.Group>
                      <label>Name</label>
                      <Form.Control
                        defaultValue={userData.name}
                        placeholder="Name"
                        type="text"
                        {...register("name")}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-1" md="12">
                    <Form.Group>
                      <label>Email</label>
                      <small className="text-danger">
                        *{errors ? errors.email : null}{" "}
                      </small>

                      <Form.Control
                        defaultValue={userData.email}
                        placeholder="Email"
                        type="text"
                        {...register("email")}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-1" md="12">
                    <Form.Group>
                      <label>
                        username
                        <small className="text-danger">
                          {" "}
                          *{errors ? errors.username : null}{" "}
                        </small>
                      </label>
                      <Form.Control
                        defaultValue={userData.username}
                        placeholder="UserName"
                        type="text"
                        {...register("username")}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-1" md="12">
                    <Form.Group>
                      <label>
                        Password
                        <small className="text-danger">
                          *{errors ? errors.password : null}{" "}
                        </small>
                      </label>

                      <Form.Control
                        defaultValue={userData.password}
                        placeholder="Password"
                        type="text"
                        {...register("password")}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-1" md="12">
                    <Form.Group>
                      <label>
                        Role
                        <small className="text-danger">
                          *{errors ? errors.role : null}{" "}
                        </small>
                      </label>
                      <Form.Control
                        defaultValue={userData.role_id}
                        placeholder="Role"
                        type="text"
                        {...register("role_id")}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-1" md="12">
                    <Form.Group>
                      <label>
                        Mobile Number
                        <small className="text-danger">
                          *{errors ? errors.role : null}
                        </small>
                      </label>
                      <Form.Control
                        defaultValue={userData.mobile_number}
                        placeholder="Mobile Number"
                        type="text"
                        {...register("mobile_number")}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <button
                  className="btn custom_theme_button"
                  type="submit"
                  variant="info"
                >
                  Update Profile
                </button>
                <div className="clearfix"></div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default EditUser;
