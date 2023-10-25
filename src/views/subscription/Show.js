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
  const [subscription, setSubscription] = useState({})
  const { get, response, loading, error } = useFetch()
  useEffect(()=>{ loadSubscription() }, [])

  async function loadSubscription() {
    const api = await get(`/v1/platform_admin/subscriptions/${id}`)
    if (response.ok) {
      setSubscription(api.data.subscription)
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
                        <span>{subscription.name}</span>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                    <Form.Group>
                        <label>Slug: </label>
                        <span>{subscription.max_no_of_units}</span>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                    <Form.Group>
                        <label>Slug: </label>
                        <span>{subscription.max_no_of_compounds}</span>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Created_at:</label>
                        <span>{subscription.created_at}</span>

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
