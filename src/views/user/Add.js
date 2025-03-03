import React, { useEffect, useState } from "react";
import useFetch from "use-http";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { format_react_select } from "services/utility_functions";

import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

function Add() {
  const { register, handleSubmit, setValue, control } = useForm();

  const { companyId } = useParams();
  const { get, post, response } = useFetch();
  const [userData, setUserData] = useState({});
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
  }, []);

  async function fetchRoles() {
    const api = await get("/v1/admin/roles");
    if (response.ok) {
      setRoles_data(format_react_select(api.data, ["id", "name"]));
    }
  }

  async function onSubmit(data) {
    console.log(data);
    const api = await post(`/v1/platform_admin/companies/${companyId}/users`, {
      user: data,
    });
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
    <>
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
                          Username
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
                    Save
                  </button>
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Add;
