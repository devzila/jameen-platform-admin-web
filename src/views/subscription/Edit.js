import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useFetch from "use-http";
import { toast } from "react-toastify";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";

function Edit() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { id } = useParams();
  const { get, put, response, loading, error } = useFetch();
  const navigate = useNavigate();

  useEffect(() => {
    loadSubscription();
  }, [id]);

  async function loadSubscription() {
    const api = await get(`/v1/platform_admin/subscriptions/${id}`);
    if (response.ok) {
      setValue("name", api.data.name);
      setValue("max_no_of_units", api.data.max_no_of_units);
      setValue("max_no_of_compounds", api.data.max_no_of_compounds);
    }
  }

  async function onSubmit(data) {
    console.log(data);
    const api = await put(`/v1/platform_admin/subscriptions/${id}`, {
      subscription: data,
    });
    if (response.ok) {
      navigate("/subscriptions");
      toast.success("Subscription updated successfully");
    } else {
      toast.error(response.data?.message || "Error editing subscription");
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
                    <Card.Title as="h4">Edit Subscription</Card.Title>
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
                          placeholder="Subscription Name"
                          type="text"
                          {...register("name")}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Max Number of Units</label>
                        <Form.Control
                          placeholder="0"
                          type="number"
                          {...register("max_no_of_units")}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Max Number of Compounds</label>
                        <Form.Control
                          placeholder="0"
                          type="number"
                          {...register("max_no_of_compounds")}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    className="btn-fill pull-right"
                    type="submit"
                    variant="info"
                  >
                    Update
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

export default Edit;
