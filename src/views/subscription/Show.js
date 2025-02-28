import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "use-http";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { formatdate } from "services/utility_functions";

function Show() {
  const { id } = useParams();
  const [subscription, setSubscription] = useState({});
  const { get, response, loading, error } = useFetch();
  const navigate = useNavigate();

  useEffect(() => {
    loadSubscription();
  }, []);

  async function loadSubscription() {
    const api = await get(`/v1/platform_admin/subscriptions/${id}`);
    if (response.ok) {
      setSubscription(api.data);
    }
  }

  const goBack = () => {
    navigate(-1);
  };

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
                        <label>max_no_of_units </label>
                        <span>{subscription.max_no_of_units}</span>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>max_no_of_compounds </label>
                        <span>{subscription.max_no_of_compounds}</span>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Created_at:</label>
                        <span>{formatdate(subscription.created_at)}</span>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Button className="btn-fill pull-right" variant="info" onClick={goBack}>
          Go Back
        </Button>
      </Container>
    </>
  );
}

export default Show;
