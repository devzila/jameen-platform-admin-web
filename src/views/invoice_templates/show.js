"use client";

import { useRouter, useParams } from "next/navigation";
import React, {
  useEffect,
  useState,
} from 'react'

import useApi from "hooks/useApi";


import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
} from 'react-bootstrap'

import dateFormat from '../../utilities/DateFormat'
function Show() {
  const { id } = useParams()

  const router = useRouter()

  const { get, loading } =
    useApi()

  const [template, setTemplate] =
    useState(null)

  useEffect(() => {
    loadTemplate()
  }, [])

  const loadTemplate =
    async () => {
      try {
        const response =
          await get(
            `/v1/platform_admin/invoice_templates/${id}`,
          )

        setTemplate(
          response?.data ||
            response,
        )
      } catch (err) {
        console.log(err)
      }
    }

  const renderJson = (
    data,
  ) => {
    if (
      !data ||
      Object.keys(data)
        .length === 0
    ) {
      return '-'
    }

    return (
      <pre
        style={{
          marginBottom: 0,
          fontSize: '13px',
          whiteSpace:
            'pre-wrap',
        }}
      >
        {JSON.stringify(
          data,
          null,
          2,
        )}
      </pre>
    )
  }

  if (
    loading ||
    !template
  ) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" />

          <div className="mt-2">
            Loading...
          </div>
        </div>
      </Container>
    )
  }
  return (
  <Container fluid>
    <Row className="mt-3">
      <Col md="12">
        <Card>

          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <Card.Title as="h4" className="mb-0">
                Invoice Template Details
              </Card.Title>

              <Button
                variant="info"
                className="rounded-0"
                onClick={() =>
                  router.push('/invoice-templates')
                }
              >
                Go Back
              </Button>
            </div>
          </Card.Header>

          <Card.Body>
            <table className="table table-bordered">

              <tbody>

                <tr>
                  <th width="30%">
                    ID
                  </th>

                  <td>
                    {template.id}
                  </td>
                </tr>

                <tr>
                  <th>Name</th>

                  <td>
                    {template.name}
                  </td>
                </tr>

                <tr>
                  <th>
                    Description
                  </th>

                  <td>
                    {template.description ||
                      '-'}
                  </td>
                </tr>

                <tr>
                  <th>
                    Processor Class
                  </th>

                  <td>
                    {
                      template.processor_class
                    }
                  </td>
                </tr>

                <tr>
                  <th>
                    Category Id
                  </th>

                  <td>
                    {template.category_name ||
                      '-'}
                  </td>
                </tr>

                <tr>
                  <th>
                    Is Default
                  </th>

                  <td>
                    {template.is_default ? (
                      <Badge bg="success">
                        Yes
                      </Badge>
                    ) : (
                      <Badge bg="secondary">
                        No
                      </Badge>
                    )}
                  </td>
                </tr>

                <tr>
                  <th>
                    Class Level
                  </th>

                  <td>
                    {renderJson(
                      template.class_level,
                    )}
                  </td>
                </tr>

                <tr>
                  <th>
                    Instance Level
                  </th>

                  <td>
                    {renderJson(
                      template.instance_level,
                    )}
                  </td>
                </tr>

                <tr>
                  <th>
                    Created At
                  </th>

                  <td>
                    {template.created_at
                      ? dateFormat(
                          template.created_at.substring(
                            0,
                            10,
                          ),
                        )
                      : '-'}
                  </td>
                </tr>

                <tr>
                  <th>
                    Updated At
                  </th>

                  <td>
                    {template.updated_at
                      ? dateFormat(
                          template.updated_at.substring(
                            0,
                            10,
                          ),
                        )
                      : '-'}
                  </td>
                </tr>

              </tbody>

            </table>

          </Card.Body>

        </Card>
      </Col>
    </Row>
  </Container>
)
}

export default Show
