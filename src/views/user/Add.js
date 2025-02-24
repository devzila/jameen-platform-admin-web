import React, { useEffect, useState } from "react";
import useFetch from "use-http";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

function Add() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const { companyId } = useParams();
  const { get, post, response } = useFetch();
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {}, []);

  async function onSubmit(data) {
    console.log(data);
    const api = await post(`/v1/platform_admin/companies/${companyId}/users`, {
      user: data,
    });
    if (response.ok) {
      setValue("name", api.data.name);
      setValue("email", api.data.email);
      setValue("mobile_number", api.data.mobile_number);
      setValue("username", api.data.username);
      setValue("password", api.data.password);
      setValue("role_id", api.data.role_id);
      navigate(`/companies/${companyId}/users`);
      toast("user added Successfully");
    } else {
      toast(response.data?.message);
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
                        <label>username</label>
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
                        <label>Password</label>
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
                        <label>Role</label>
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
                        <label>Ph No</label>
                        <Form.Control
                          defaultValue={userData.mobile_number}
                          placeholder="Ph Number"
                          type="text"
                          {...register("mobile_number")}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    className="btn-fill pull-right"
                    type="submit"
                    variant="info"
                  >
                    Update Profile
                  </Button>
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
