import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "use-http";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import Select from "react-select";

import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";

function Add() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    setError,
    formState: { errors },
  } = useForm();

  const { get, post, response } = useFetch();
  const [companyData, setCompanyData] = useState({});
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [country_array, setCountry_array] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadSubscriptionPlans() {
      const api = await get(`/v1/platform_admin/options`);
      if (response.ok) {
        setSubscriptionPlans(
          api.subscription_plans.map((element) => ({
            value: element.id,
            label: element.name,
          })) || []
        );
      }
    }
    loadCountry();

    loadSubscriptionPlans();
  }, [get, response]);

  async function loadCountry() {
    const endpoint = await get(`/v1/platform_admin/countries`);
    if (response.ok) {
      formatcountrydata(endpoint);
    }
  }

  function formatcountrydata(data) {
    const temp_array = data.map((element) => ({
      label: element.name_en,
      value: element.id,
    }));
    setCountry_array(temp_array);
  }

  async function onSubmit(data) {
    const { logo, ...companyFields } = data;
    const hasLogo =
      logo &&
      typeof logo.length === "number" &&
      logo.length > 0 &&
      logo[0] instanceof File;

    const body = hasLogo
      ? (() => {
          const fd = new FormData();
          Object.entries(companyFields).forEach(([key, value]) => {
            if (value != null && value !== "") {
              fd.append(`company[${key}]`, value);
            }
          });
          fd.append("company[logo]", logo[0]);
          return fd;
        })()
      : { company: companyFields };

    const api = await post(`/v1/platform_admin/companies`, body);
    if (response.ok) {
      navigate("/companies");
      toast.success("Successfully Created");
    } else {
      if (response.status === 422 && response.data?.errors) {
        Object.entries(response.data.errors).forEach(([field, fieldErrors]) => {
          if (Array.isArray(fieldErrors) && fieldErrors.length) {
            setError(field, { type: "server", message: fieldErrors[0] });
          }
        });
      } else {
        toast.error(response.data?.message);
      }
    }
  }
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Container fluid>
        <Row className="mt-3 ">
          <Col md="12">
            <Card>
              <Card.Header>
                <Row>
                  <Col md="6">
                    <Card.Title as="h4">Add Company</Card.Title>
                  </Col>
                  <Col md="6" className="text-right ">
                    <Button
                      variant="info"
                      className="rounded-0"
                      onClick={handleGoBack}
                    >
                      Go Back
                    </Button>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <Form.Label>Logo</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                          isInvalid={!!errors.logo}
                          {...register("logo")}
                        />
                        <Form.Text className="text-muted">
                          JPG or PNG
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">
                          {errors.logo?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Name</label>
                        <Form.Control
                          defaultValue={companyData.name}
                          placeholder="User Name"
                          type="text"
                          isInvalid={!!errors.name}
                          {...register("name")}
                        ></Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.name?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Identifier</label>
                        <Form.Control
                          defaultValue={companyData.slug}
                          placeholder="slug"
                          type="text"
                          isInvalid={!!errors.slug}
                          {...register("slug")}
                        ></Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.slug?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col className="pr-1 mt-3" md="12">
                      <Form.Group>
                        <label>Subscription</label>

                        <Controller
                          name="subscription_id"
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={subscriptionPlans}
                              value={subscriptionPlans.find(
                                (c) => c.value === field.value
                              )}
                              onChange={(val) => field.onChange(val.value)}
                              placeholder=" Select Subscription"
                            />
                          )}
                          control={control}
                        />
                        {errors.subscription_id && (
                          <div className="text-danger mt-1">
                            {errors.subscription_id.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1 mt-3" md="12">
                      <Form.Group>
                        <label>Country</label>

                        <Controller
                          name="country_id"
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={country_array}
                              value={country_array.find(
                                (c) => c.value === field.value
                              )}
                              onChange={(val) => field.onChange(val.value)}
                            />
                          )}
                          control={control}
                          placeholder="Role"
                        />
                        {errors.country_id && (
                          <div className="text-danger mt-1">
                            {errors.country_id.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    className="rounded-0 btn-fill mt-3"
                    type="submit"
                    variant="info"
                  >
                    Add Company
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

export default Add;
