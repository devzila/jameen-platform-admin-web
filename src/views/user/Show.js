import React, { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
import useFetch from 'use-http'

// react-bootstrap components
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col
} from "react-bootstrap";

function Show() {
  const { id } = useParams()
  const [user, setUser] = useState({})
  const { get, response, loading, error } = useFetch()
  useEffect(()=>{ loadUser() }, [])

  async function loadUser() {
    const api = await get(`/v1/platform_admin/companies/1/users/${id}`)
    if (response.ok) {
      setUser(api.data.user)
    }
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card>
              <Card.Body>
                <Form>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Name:</label>
                        <span>{user.name}</span>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                    <Form.Group>
                        <label>email: </label>
                        <span>{user.email} </span>

                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Ph-No:</label>
                        <span>{user.mobile_number} </span>

                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Created At:</label>
                        <span>{user.created_at} </span>

                      </Form.Group>
                    </Col>
                  </Row>
                 
                  <Button
                    className="btn-fill pull-right"
                    variant="info"
                  >
                    Edit
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

export default Show;