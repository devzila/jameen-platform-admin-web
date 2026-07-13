import React, {
  useEffect,
  useState,
} from 'react'
import useFetch from 'use-http'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
} from 'react-bootstrap'

function Edit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { get, put, loading } =
    useFetch()

  const [formData, setFormData] =
    useState({
      name: '',
      description: '',
      processor_class: '',
      category_id: '',
      class_level: '{\n\n}',
      instance_level: '{\n\n}',
      is_default: false,
    })

  const [errors, setErrors] =
    useState({})

  const [jsonErrors, setJsonErrors] =
    useState({
      class_level: '',
      instance_level: '',
    })

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

        const template =
          response?.data ||
          response

        setFormData({
          name:
            template.name || '',
          description:
            template.description ||
            '',
          processor_class:
            template.processor_class ||
            '',
          category_id:
            template.category_id ||
            '',
          class_level:
            JSON.stringify(
              template.class_level ||
                {},
              null,
              2,
            ),
          instance_level:
            JSON.stringify(
              template.instance_level ||
                {},
              null,
              2,
            ),
          is_default:
            template.is_default ||
            false,
        })
      } catch (err) {
        console.log(err)
      }
    }
      const handleChange = (e) => {
    const {
      name,
      value,
      checked,
      type,
    } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]:
        type ===
        'checkbox'
          ? checked
          : value,
    }))

    if (
      name ===
        'class_level' ||
      name ===
        'instance_level'
    ) {
      validateJsonField(
        name,
        value,
      )
    }
  }

  const validateJsonField = (
    name,
    value,
  ) => {
    try {
      JSON.parse(
        value || '{}',
      )

      setJsonErrors(
        (prev) => ({
          ...prev,
          [name]: '',
        }),
      )

      return true
    } catch {
      setJsonErrors(
        (prev) => ({
          ...prev,
          [name]:
            'Invalid JSON format',
        }),
      )

      return false
    }
  }

  const handleSubmit =
    async (e) => {
      e.preventDefault()

      const validationErrors =
        {}

      if (
        !validateJsonField(
          'class_level',
          formData.class_level,
        )
      ) {
        validationErrors.class_level =
          'Invalid JSON format'
      }

      if (
        !validateJsonField(
          'instance_level',
          formData.instance_level,
        )
      ) {
        validationErrors.instance_level =
          'Invalid JSON format'
      }

      setErrors(
        validationErrors,
      )

      if (
        Object.keys(
          validationErrors,
        ).length > 0
      )
        return

      const payload = {
        invoice_template: {
          name:
            formData.name,
          description:
            formData.description,
          processor_class:
            formData.processor_class,
          category_id:
            Number(
              formData.category_id,
            ),
          is_default:
            formData.is_default,
          class_level:
            JSON.parse(
              formData.class_level ||
                '{}',
            ),
          instance_level:
            JSON.parse(
              formData.instance_level ||
                '{}',
            ),
        },
      }

      try {
        await put(
          `/v1/platform_admin/invoice_templates/${id}`,
          payload,
        )

        navigate(
          '/invoice-templates',
        )
      } catch (err) {
        console.log(err)
      }
    }
      return (
    <Container fluid>
      <Row className="mt-3">
        <Col md="12">
          <Card>
            <Card.Header>
              <Card.Title as="h4">
                Edit Invoice
                Template
              </Card.Title>
            </Card.Header>

            <Card.Body>
              <Form
                onSubmit={
                  handleSubmit
                }
              >
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Template
                        Name
                      </Form.Label>

                      <Form.Control
                        type="text"
                        name="name"
                        value={
                          formData.name
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Processor
                        Class
                      </Form.Label>

                      <Form.Control
                        type="text"
                        name="processor_class"
                        value={
                          formData.processor_class
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Category
                        Id
                      </Form.Label>

                      <Form.Control
                        type="number"
                        name="category_id"
                        value={
                          formData.category_id
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Is default
                      </Form.Label>
                      <div
                        style={{
                          border: '1px solid #EAECF0',
                          borderRadius: '12px',
                          padding: '18px',
                          background: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <input
                          type="checkbox"
                          id="is_default"
                          name="is_default"
                          checked={formData.is_default}
                          onChange={handleChange}
                          style={{
                            width: '22px',
                            height: '22px',
                            cursor: 'pointer',
                            accentColor: '#1570EF',
                            display: 'block',
                          }}
                        />

                        <label
                          htmlFor="is_default"
                          style={{
                            margin: 0,
                            fontSize: '16px',
                            fontWeight: 500,
                            color: '#344054',
                            cursor: 'pointer',
                          }}
                        >
                          Mark This Template As Default
                        </label>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Description
                  </Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={
                      handleChange
                    }
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Class
                        Level
                        JSON
                      </Form.Label>

                      <Form.Control
                        as="textarea"
                        rows={6}
                        name="class_level"
                        value={
                          formData.class_level
                        }
                        onChange={
                          handleChange
                        }
                        isInvalid={
                          !!jsonErrors.class_level
                        }
                      />

                      <Form.Control.Feedback type="invalid">
                        {
                          jsonErrors.class_level
                        }
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Instance
                        Level
                        JSON
                      </Form.Label>

                      <Form.Control
                        as="textarea"
                        rows={6}
                        name="instance_level"
                        value={
                          formData.instance_level
                        }
                        onChange={
                          handleChange
                        }
                        isInvalid={
                          !!jsonErrors.instance_level
                        }
                      />

                      <Form.Control.Feedback type="invalid">
                        {
                          jsonErrors.instance_level
                        }
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="me-2"
                    onClick={() =>
                      navigate(
                        '/invoice-templates',
                      )
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={
                      loading
                    }
                  >
                    {loading
                      ? 'Updating...'
                      : 'Update Template'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Edit