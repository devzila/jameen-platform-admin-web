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
  const [companyData, setCompanyData] = useState({})

  useEffect(()=>{
    loadComapny()
  }, [id])

  async function loadComapny() {
    const api = await get(`/v1/platform_admin/companies/${id}`)
    if (response.ok) {
      setCompanyData(api.data.company)
    }
  }

  async function onSubmit(data) { 
    console.log(data)
    const api = await put(`/v1/platform_admin/companies/${id}`, {company: data})
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
                <Card.Title as="h4">Edit Company</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit(onSubmit)}> 
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Name</label>
                        <Form.Control
                          defaultValue={companyData.name}
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
                        <Form.Control
                          defaultValue={companyData.slug}
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
                        <Form.Control
                          defaultValue={companyData.subscription?.name}
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
