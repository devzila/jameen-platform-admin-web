import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import useFetch from "use-http";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

function EditUser() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { companyId, userId } = useParams();
  const { get, put, response, loading, error } = useFetch();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    loadUser();
  }, [userId]);

  async function loadUser() {
    const api = await get(`/v1/platform_admin/companies/${companyId}/users/${userId}`);
    if (response.ok) {
      setUserData(api.data.user);
    }
  }
  async function onSubmit(data) {
    try {
      const api = await put(`/v1/platform_admin/companies/${companyId}/users/${userId}`, { user: data });
      if (api.ok) {
      } else {
        const responseData = await api.json(); 
        console.error("Error updating user:", responseData.errors);
      }
    } catch (error) {
      console.error("Error updating user:", error.message);
    }
  }
  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Edit User</Card.Title>
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