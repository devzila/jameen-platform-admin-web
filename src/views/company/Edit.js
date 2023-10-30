import React, { useEffect, useContext } from "react"
import { useParams, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useForm } from "react-hook-form"
import useFetch from 'use-http'
import AppDataContext from "contexts/AppDataContext"

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
    setValue,
    formState: { errors },
  } = useForm()

  const { id } = useParams()
  const { get, put, response, loading, error } = useFetch()
  const appData = useContext(AppDataContext)
  const history = useHistory()

  useEffect(()=>{
    loadComapny()
  }, [])

  async function loadComapny() {
    const api = await get(`/v1/platform_admin/companies/${id}`)
    if (response.ok) {
      setValue('name', api.data.company.name)
      setValue('slug', api.data.company.slug)
      setValue('subscription_id', api.data.company.subscription.id)
    }
  }

  async function onSubmit(data) { 
    const api = await put(`/v1/platform_admin/companies/${id}`, {company: data})
    if (response.ok) {
      history.push("/companies")
    }
    else{
      toast(response.data?.message)
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
                        <label>Subscription</label>
                        <Form.Select {...register("subscription_id")}>
                          {Array.isArray(appData?.subscription_plans) &&
                            appData.subscription_plans.map(plan => (
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
