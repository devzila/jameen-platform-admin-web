import React, { useEffect, useState } from "react";
import useFetch from 'use-http';
import { useForm } from "react-hook-form"
// react-bootstrap components
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col
} from "react-bootstrap";


function Add() {
    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm()

    const { get, post, response } = useFetch();
    const [subscriptionData, setSubscriptionData] = useState({})
    
    useEffect(()=>{

    }, [])

    async function onSubmit(data) {
      console.log(data)
      const api = await post(`/v1/platform_admin/subscriptions`, { subscription: data })
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
                <Card.Title as="h4">Add Subscription</Card.Title>
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
                        <label>Email</label>
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
                        <label>subscriptionname</label>
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
