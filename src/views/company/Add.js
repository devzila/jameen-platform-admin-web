import React, { useEffect, useState } from "react";
import useFetch from 'use-http';
import { useForm } from "react-hook-form"

import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
  FormSelect
} from "react-bootstrap";
import { post } from "jquery";

function Add() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()


  const { get, post, response } = useFetch();
  const [companyData, setCompanyData] = useState({})
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);


  useEffect(() => {
    async function loadSubscriptionPlans() {
      const api = await get(`/v1/platform_admin/options`);
      if (response.ok) {
        setSubscriptionPlans(api.subscription_plans || []);
      }
    }

    loadSubscriptionPlans();
  }, [get, response]);

  async function onSubmit(data) {
    console.log(data)
    const api = await post(`/v1/platform_admin/companies`, { company: data })
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
                <Card.Title as="h4">Add Company</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  {/* Your form code */}

                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Name</label>
                        <Form.Control
                          defaultValue={companyData.name}
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
                        <label>Identifier</label>
                        <Form.Control
                          defaultValue={companyData.slug}
                          placeholder="slug"
                          type="text"
                          {...register("slug")}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Scheme</label>

                        <Form.Select
                          defaultValue={companyData.subscription}
                          {...register("scheme", { required: true })}
                        >
                          {Array.isArray(subscriptionPlans) &&
                            subscriptionPlans.map(plan => (
                              <option key={plan.id} value={plan.id}>{plan.name}</option>
                            ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    className="btn-fill pull-right"
                    type="submit"
                    variant="info"
                  >
                    Add Company
                  </Button>
                  <div className="clearfix"></div>

                  {/* Your form code */}
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
