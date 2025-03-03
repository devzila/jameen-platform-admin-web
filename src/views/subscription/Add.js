import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "use-http";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";

function Add() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const { get, post, response } = useFetch();
  const [subscriptionData, setSubscriptionData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {}, []);

  async function onSubmit(data) {
    console.log(data);
    const api = await post(`/v1/platform_admin/subscriptions`, {
      subscription: data,
    });
    if (response.ok) {
      navigate("/subscriptions");
      toast.success("Successfully Created");
    } else {
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
                    <Card.Title as="h4">Add Subscription</Card.Title>
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
                          defaultValue={subscriptionData.name}
                          placeholder="Subscription name"
                          type="text"
                          {...register("name")}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>MAX UNITS</label>
                        <Form.Control
                          defaultValue={subscriptionData.max_no_of_units}
                          placeholder="Units"
                          type="number"
                          {...register("max_no_of_units")}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>MAX COMPOUNDS</label>
                        <Form.Control
                          defaultValue={subscriptionData.max_no_of_compounds}
                          placeholder="Compounds"
                          type="number"
                          {...register("max_no_of_compounds")}
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
