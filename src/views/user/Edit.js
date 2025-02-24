import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useFetch from "use-http";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

function EditUser() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { companyId, userId, role_id } = useParams();
  const { get, put, response, loading, error } = useFetch();
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, [userId]);

  async function loadUser() {
    const api = await get(
      `/v1/platform_admin/companies/${companyId}/users/${userId}`
    );
    if (response.ok) {
      setValue("name", api.data.user.name);
      setValue("email", api.data.user.email);
      setValue("mobile_number", api.data.user.mobile_number);
      setValue("username", api.data.user.username);
      setValue("role_id", api.data.user.role_id);
    }
  }
  async function onSubmit(data) {
    const api = await put(
      `/v1/platform_admin/companies/${companyId}/users/${userId}`,
      { user: data }
    );
    if (response.ok) {
      navigate(`/companies/${companyId}/users`);
      toast.success("User updated successfully");
    } else {
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
                  <Card.Title as="h4">Edit Company</Card.Title>
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
                        placeholder="User Name"
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
                      <label>Phone Number</label>
                      <Form.Control
                        defaultValue={userData.mobile_number}
                        placeholder="Phone Number"
                        type="text"
                        {...register("mobile_number")}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-1" md="12">
                    <Form.Group>
                      <label>UserName</label>
                      <Form.Control
                        defaultValue={userData.username}
                        placeholder="username"
                        type="text"
                        {...register("username")}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col className="pr-1" md="12">
                    <Form.Group>
                      <label>Role_id</label>
                      <Form.Control
                        defaultValue={userData.role}
                        placeholder="Role_id"
                        type="text"
                        {...register("role.id")}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  className="btn-fill pull-right"
                  type="submit"
                  variant="info"
                >
                  Update User
                </Button>
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
