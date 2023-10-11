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
    email: yup.string().required(),
    mobile_number: yup.number().positive().integer().required()
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
  const [userData, setUserData] = useState({})

  useEffect(()=>{
    loadUser()
  }, [id])

  async function loadUser() {
    const api = await get(`/v1/platform_admin/companies/${id}/users/add`)
    if (response.ok) {
      setUserData(api.data.user)
    }
  }
  async function onSubmit(data) { 
    console.log(data)
    const api = await put(`/v1/platform_admin/companies/${id}/users/add`, {user: data})
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
                <Card.Title as="h4">Add User</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Name</label>
                        <p>{errors.name?.message}</p>
                        <Form.Control
                          value={userData.name}
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
                        <p>{errors.email?.message}</p>
                        <Form.Control
                          value={userData.email}
                          placeholder="Identifier"
                          type="text"
                          {...register("email")}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Ph No</label>
                        <Form.Control
                          value={userData.mobile_number}
                          placeholder="Subscription Scheme"
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
