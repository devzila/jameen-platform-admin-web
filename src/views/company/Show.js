import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "use-http";
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { formatdate } from "services/utility_functions";

function Show() {
  const { id } = useParams();
  const [company, setCompany] = useState({});
  const { get, response, loading, error } = useFetch();
  const navigate = useNavigate();
  useEffect(() => {
    loadCompany();
  }, []);

  async function loadCompany() {
    const api = await get(`/v1/platform_admin/companies/${id}`);
    if (response.ok) {
      setCompany(api.data);
    }
  }
  const handleGoBack = () => {
    navigate(-1);
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
                    <Card.Title as="h4">Edit Company</Card.Title>
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
                        <span>{company.name}</span>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Slug: </label>
                        <span>{company.slug}</span>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Created_at:</label>
                        <span>{formatdate(company.created_at)}</span>
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
