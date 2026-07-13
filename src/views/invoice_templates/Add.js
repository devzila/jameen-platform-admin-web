import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
} from 'react-bootstrap'
import { toast } from 'react-toastify'

function Add() {
  const navigate = useNavigate()
  const { 
    post, 
    get,
    response, 
    loading 
  } = useFetch()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    processor_class: '',
    category_id: '',
    class_level: '{\n\n}',
    instance_level: '{\n\n}',
    is_default: false,
  })

  const [errors, setErrors] = useState({})
  const [jsonErrors, setJsonErrors] =
    useState({
      class_level: '',
      instance_level: '',
    })

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }))

    if (
      name === 'class_level' ||
      name === 'instance_level'
    ) {
      validateJsonField(name, value)
    }
  }
    const validateJsonField = (
    name,
    value,
  ) => {
    try {
      JSON.parse(value || '{}')

      setJsonErrors((prev) => ({
        ...prev,
        [name]: '',
      }))

      return true
    } catch {
      setJsonErrors((prev) => ({
        ...prev,
        [name]:
          'Invalid JSON format',
      }))

      return false
    }
  }

  const validate = () => {
    const validationErrors = {}

    if (!formData.name.trim()) {
      validationErrors.name =
        'Template Name is required'
    }

    if (
      !formData.description.trim()
    ) {
      validationErrors.description =
        'Description is required'
    }

    if (
      !formData.processor_class.trim()
    ) {
      validationErrors.processor_class =
        'Processor Class is required'
    }

    if (!formData.category_id) {
      validationErrors.category_id =
        'Category Id is required'
    }

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

    setErrors(validationErrors)

    return (
      Object.keys(validationErrors)
        .length === 0
    )
  }

  const [categories, setCategories] = useState([])

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const api = await get(
      '/v1/platform_admin/invoice_categories',
    )

    if (response.ok) {
      setCategories(api.data || api)
    }
  }

  const handleSubmit =
    async (e) => {
      e.preventDefault()

      if (!validate()) return

      const payload = {
        invoice_template: {
          name: formData.name,
          description:
            formData.description,
          processor_class:
            formData.processor_class,
          category_id: Number(
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

      const api = await post(
        '/v1/platform_admin/invoice_templates',
        payload,
      )

      if (response.ok) {
        toast.success(
          'Invoice Template Created Successfully',
        )

        navigate(
          '/invoice-templates',
        )
      } else {
        toast.error(
          api?.message ||
            'Unable to create template'
        )
      }
    }
      return (
    <Container fluid>
      <Row className="mt-3">
        <Col md="12">
          <Card>
            <Card.Header>
              <Row>
                <Col md="6">
                  <Card.Title as="h4">
                    Add Invoice Template
                  </Card.Title>
                </Col>

                <Col
                  md="6"
                  className="text-right"
                >
                  <Button
                    variant="info"
                    className="rounded-0"
                    onClick={() =>
                      navigate(
                        '/invoice-templates',
                      )
                    }
                  >
                    Go Back
                  </Button>
                </Col>
              </Row>
            </Card.Header>

            <Card.Body>
              <Form
                onSubmit={
                  handleSubmit
                }
              >
                <Row>
                  <Col md="6">
                    <Form.Group>
                      <Form.Label>
                        Template Name
                      </Form.Label>

                      <Form.Control
                        name="name"
                        value={
                          formData.name
                        }
                        onChange={
                          handleChange
                        }
                        isInvalid={
                          !!errors.name
                        }
                        placeholder="Enter template name"
                      />

                      <Form.Control.Feedback type="invalid">
                        {
                          errors.name
                        }
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md="6">
                    <Form.Group>
                      <Form.Label>
                        Processor
                        Class
                      </Form.Label>

                      <Form.Control
                        name="processor_class"
                        value={
                          formData.processor_class
                        }
                        onChange={
                          handleChange
                        }
                        isInvalid={
                          !!errors.processor_class
                        }
                        placeholder="InvoiceProcessors::DueReminder"
                      />

                      <Form.Control.Feedback type="invalid">
                        {
                          errors.processor_class
                        }
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md="6">
                    <Form.Group>
                      <Form.Label>
                        Invoice Category
                      </Form.Label>

                      <div
                        style={{
                          background: '#ffffff',
                          border: '1px solid #EAECF0',
                          borderRadius: '12px',
                          padding: '6px',
                          boxShadow:
                            '0px 1px 3px rgba(16,24,40,0.08)',
                        }}
                      >
                        <Form.Select
                          name="category_id"
                          value={formData.category_id || ''}
                          onChange={handleChange}
                          isInvalid={!!errors.category_id}
                          style={{
                            border: 'none',
                            boxShadow: 'none',
                            height: '45px',
                            fontSize: '15px',
                            color: '#344054',
                            cursor: 'pointer',
                            backgroundColor: '#fff',
                          }}
                        >
                          <option value="">
                            📂 Select Invoice Category
                          </option>

                          {categories &&
                            categories.map((category) => (
                              <option
                                key={category.id}
                                value={category.id}
                              >
                                {category.name}
                              </option>
                            ))}
                        </Form.Select>
                      </div>

                      {errors.category_id && (
                        <div
                          style={{
                            color: '#dc3545',
                            fontSize: '13px',
                            marginTop: '6px',
                          }}
                        >
                          {errors.category_id}
                        </div>
                      )}

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

                <Row className="mt-3">
                  <Col md="12">
                    <Form.Group>
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
                        isInvalid={
                          !!errors.description
                        }
                      />

                      <Form.Control.Feedback type="invalid">
                        {
                          errors.description
                        }
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md="12">
                    <Form.Group>
                      <Form.Label>
                        Class Level
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

                  <Col md="12">
                    <Form.Group>
                      <Form.Label>
                        Instance Level
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

                <Button
                  className="rounded-0 btn-fill mt-4"
                  variant="info"
                  type="submit"
                  disabled={
                    loading
                  }
                >
                  {loading
                    ? 'Saving...'
                    : 'Add Invoice Template'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Add