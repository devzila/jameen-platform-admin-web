import React, { useEffect, useState } from "react"
import useFetch from 'use-http'

// react-bootstrap components
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
  FormSelect
} from "react-bootstrap";

function Add() {
  const { get, post, response, loading, error } = useFetch()
  const [subscriptionPlans, setSubscriptionPlans] = useState({})

  useEffect(()=>{
    loadSubscriptionPlans()
  }, [])

  async function loadSubscriptionPlans() {
    const api = await get(`/v1/platform_admin/options`)
    if (response.ok) {
      setSubscriptionPlans(api.subscription_plans)
    }
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Add Company</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Name</label>
                        <Form.Control
                          defaultValue=""
                          placeholder="Company Name"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                    <Form.Group>
                        <label>Identifier (No space, No special letter)</label>
                        <Form.Control
                          defaultValue=""
                          placeholder="Identifier"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Scheme</label>
                        <Form.Select>
                        {subscriptionPlans.map(plan => 
                          <option id={plan.id}>{plan.name}</option>
                        )}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    className="btn-fill pull-right"
                    type="submit"
                    variant="info"
                  >
                    Submit
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
