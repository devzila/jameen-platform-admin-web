import React, { useEffect, useState } from "react"
import { useParams } from 'react-router-dom'
import { useForm } from "react-hook-form"
import useFetch from 'use-http'

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Form,
  Navbar,
  Nav,
  Container,
  Row,
  Col
} from "react-bootstrap";

function Edit() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const { id } = useParams()
  const { get, put, response, loading, error } = useFetch()
  const [subscriptionData, setSubscriptionData] = useState({})

  useEffect(()=>{
    loadSubscription()
  }, [id])


  async function loadSubscription() {
    const api = await get(`/v1/platform_admin/subscriptions/${id}`)
    if (response.ok) {
      setSubscriptionData(api.data.subscription)
    }
  }

  async function onSubmit(data) { 
    console.log(data)
    const api = await put(`/v1/platform_admin/subscriptions/${id}`, {subscription: data})
    if (response.ok) {
    }
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Edit subscription</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit(onSubmit)}> 
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Name</label>
                        <Form.Control
                          defaultValue={subscriptionData.name}
                          placeholder="subscription Name"
                          type="text"
                          {...register("name")}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                    <Form.Group>
                        <label>max_no_of_units</label>
                        <Form.Control
                          defaultValue={subscriptionData.max_no_of_units}
                          placeholder="Identifier"
                          type="text"
                          {...register("max_no_of_units")}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                    <Form.Group>
                        <label>max_no_of_compounds</label>
                        <Form.Control
                          defaultValue={subscriptionData.max_no_of_compounds}
                          placeholder="Identifier"
                          type="text"
                          {...register("max_no_of_compounds")}
                        ></Form.Control>
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
