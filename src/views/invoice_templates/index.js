"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react'
import useApi from "hooks/useApi";
import Paginate from '../../components/Paginate'
import Loader from 'components/Loader'
import { BsThreeDots } from 'react-icons/bs'
import {
  Dropdown,
  Badge,
  Card,
  Container,
  Row,
  Col,
} from 'react-bootstrap'

import {
  CNavbar,
  CContainer,
  CNavbarBrand,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

import dateFormat from '../../utilities/DateFormat'

function Index() {
  const [invoiceTemplates, setInvoiceTemplates] =
    useState([])
  const [pagination, setPagination] = useState({})
  const [currentPage, setCurrentPage] =
    useState(1)
  const [searchKeyword, setSearchKeyword] =
    useState('')

  const { get, del, loading } = useApi()
  const router = useRouter()

  const addTemplate = () => {
    router.push('/invoice-templates/add')
  }

  const loadInvoiceTemplates = async () => {
    let endpoint = `/v1/platform_admin/invoice_templates?page=${currentPage}`

    if (searchKeyword.trim() !== '') {
      endpoint += `&q[name_cont]=${encodeURIComponent(
        searchKeyword,
      )}`
    }

    try {
      const response = await get(endpoint)

      console.log(
        'Invoice Templates Response:',
        response,
      )

      const templates =
        response?.data ||
        response?.invoice_templates ||
        response ||
        []

      setInvoiceTemplates(
        Array.isArray(templates)
          ? templates
          : [],
      )

      setPagination(
        response?.pagination || {},
      )

      if (
        response?.pagination &&
        currentPage >
          response.pagination.total_pages &&
        response.pagination.total_pages > 0
      ) {
        setCurrentPage(1)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadInvoiceTemplates()
  }, [currentPage, searchKeyword])

  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1)
  }

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this template?',
      )
    ) {
      return
    }

    try {
      await del(
        `/v1/platform_admin/invoice_templates/${id}`,
      )

      loadInvoiceTemplates()
    } catch (err) {
      console.error(err)
      alert(
        'Unable to delete template.',
      )
    }
  }

  const renderJson = (data) => {
    if (
      !data ||
      Object.keys(data).length === 0
    ) {
      return '-'
    }

    return (
      <pre
        className="mb-0"
        style={{
          fontSize: '12px',
          whiteSpace: 'pre-wrap',
          maxWidth: '250px',
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

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card>
            <CNavbar
              expand="lg"
              className="bg-white"
            >
              <CContainer fluid>
                <CNavbarBrand>
                  Invoice Templates
                </CNavbarBrand>

                <div className="d-flex justify-content-end">
                  <div className="d-flex align-items-center">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search by template name..."
                      value={
                        searchKeyword
                      }
                      onChange={(e) => {
                        setCurrentPage(
                          1,
                        )
                        setSearchKeyword(
                          e.target.value,
                        )
                      }}
                    />

                    <button
                      className="btn btn-outline-success ms-2"
                      onClick={
                        loadInvoiceTemplates
                      }
                    >
                      <CIcon
                        icon={
                          freeSet.cilSearch
                        }
                      />
                    </button>
                  </div>

                  <button
                    className="btn btn-primary mx-2"
                    onClick={
                      addTemplate
                    }
                  >
                    Add Template
                  </button>
                </div>
              </CContainer>
            </CNavbar>

            <Card.Body className="table-responsive">
                <div
                  style={{
                    width: '100%',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                  }}
                >
                <table
                  className="table table-striped align-middle mb-0"
                  style={{
                    minWidth: '900px',
                    whiteSpace: 'nowrap',
                  }}
                >

                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>
                        Processor Class
                      </th>
                      <th>
                        Category Id
                      </th>
                      <th>
                        Default
                      </th>
                      <th>
                        Created
                      </th>
                      <th width="60">
                        Action
                      </th>
                    </tr>
                  </thead>

                  {loading ? (
                    <tbody>
                      <tr>
                        <td
                          colSpan="9"
                          className="text-center py-5"
                        >
                          <Loader />
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>
                      {invoiceTemplates.length >
                      0 ? (
                        invoiceTemplates.map(
                          (
                            template,
                          ) => (
                            <tr
                              key={
                                template.id
                              }
                            >
                              <td className="fw-semibold">
                                {
                                  template.name
                                }
                              </td>

                              <td>
                                {template.description ||
                                  '-'}
                              </td>

                              <td>
                                <small className="text-muted">
                                  {
                                    template.processor_class
                                  }
                                </small>
                              </td>
                              <td>
                                {template.category_name || "-"}
                              </td>
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

                              <td className="text-center">
                                <Dropdown align="end">
                                  <Dropdown.Toggle
                                    variant="light"
                                    size="sm"
                                    className="border-0 shadow-none"
                                  >
                                    <BsThreeDots
                                      size={
                                        18
                                      }
                                    />
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu>
                                    <Dropdown.Item
                                      as={
                                        Link
                                      }
                                      href={`/invoice-templates/${template.id}`}
                                    >
                                      👁
                                      View
                                    </Dropdown.Item>

                                    <Dropdown.Item
                                      as={
                                        Link
                                      }
                                      href={`/invoice-templates/${template.id}/edit`}
                                    >
                                      ✏
                                      Edit
                                    </Dropdown.Item>

                                    <Dropdown.Divider />

                                    <Dropdown.Item
                                      className="text-danger"
                                      onClick={() =>
                                        handleDelete(
                                          template.id,
                                        )
                                      }
                                    >
                                      🗑
                                      Delete
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            </tr>
                          ),
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan="9"
                            className="text-center py-5"
                          >
                            <h6 className="mb-1">
                              No Invoice
                              Templates
                              Found
                            </h6>

                            <small className="text-muted">
                              Click "Add
                              Template" to
                              create your
                              first invoice
                              template.
                            </small>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  )}
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {pagination?.total_pages >
        1 && (
        <Row className="mt-3">
          <Col className="d-flex justify-content-center">
            <Paginate
              pageCount={
                pagination.total_pages
              }
              forcePage={
                currentPage - 1
              }
              onPageChange={
                handlePageClick
              }
            />
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default Index