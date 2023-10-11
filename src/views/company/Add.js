import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import { useForm } from "react-hook-form"
import useFetch from 'use-http'
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"


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
  const schema = yup
    .object({
      name: yup.string().required(),
      slug: yup.number().positive().integer().required(),
      scheme: yup.number().positive().integer().required()
    })
    .required()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const { id } = useParams()
  const { get, put, response, loading, error } = useFetch()
  const [companyData, setcompanyData] = useState({})

  useEffect(() => {
    if (id) {
      loadCompany();
    }
  }, [id]);

  async function loadComapny() {
    const api = await get(`/v1/platform_admin/companies/add`)
    if (response.ok) {
      setcompanyData(api.data.company)
    }
  }
  async function onSubmit(data) {
    console.log(data)
    const api = await put(`/v1/platform_admin/companies/add`, { company: data })
    if (response.ok) {
      console.log(data)
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
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Name</label>
                        <p>{errors.name?.message}</p>
                        <Form.Control
                          value={companyData.name}
                          placeholder="Company Name"
                          type="text"
                          {...register("name")}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Identifier (No space, No special letter)</label>
                        <p>{errors.slug?.message}</p>
                        <Form.Control
                          value={companyData.slug}
                          placeholder="Identifier"
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
                        <p>{errors.scheme?.message}</p>
                        <Form.Control
                          value={companyData.subscription?.name}
                          placeholder="Subscription Scheme"
                          type="text"
                          {...register("subscription_id")}
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
