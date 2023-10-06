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
  const [company, setCompany] = useState({})
  const { get, response, loading, error } = useFetch()
  useEffect(()=>{ loadCompany() }, [])

  async function loadCompany() {
    const api = await get(`/v1/platform_admin/companies/${id}`)
    if (response.ok) {
      setCompany(api.data.company)
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
                        <span>{company.name}</span>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                    <Form.Group>
                        <label>Identifier: </label>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Scheme:</label>
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
