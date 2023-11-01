import React, { useEffect, useState } from "react"
import { useParams, useHistory } from 'react-router-dom';
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
  const {companyId, userId, } = useParams()
  const [user, setUser] = useState({})
  const { get, response, loading, error } = useFetch()
  const history = useHistory()
  useEffect(()=>{ loadUser() }, [])

  async function loadUser() {
    const api = await get(`/v1/platform_admin/companies/${companyId}/users/${userId}`)
    if (response.ok) {
      setUser(api.data.user)
    }
  }

  const handleGoBack = () => {
    history.goBack();
  };



  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card>
            <Card.Header>
                <Row>
                  <Col md="6">
                    <Card.Title as="h4">User Show</Card.Title>
                  </Col>
                  <Col md="6" className="text-right">
                    <Button variant="info" onClick={handleGoBack}>
                      Go Back
                    </Button>
                  </Col>
                </Row>
              </Card.Header>
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
                        <label>UserName:</label>
                        <span>{user.username} </span>

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
