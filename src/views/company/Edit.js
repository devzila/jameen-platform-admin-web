import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import useFetch from "use-http";
import AppDataContext from "contexts/AppDataContext";
import Select from "react-select";
import defaultLogo from "assets/img/jameen-logo.png";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Form,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function Edit() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    formState: { errors },
  } = useForm();

  const { id } = useParams();
  const { get, put, response, loading, error } = useFetch();
  const appData = useContext(AppDataContext);
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState({});
  const [country_array, setCountry_array] = useState([]);

  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  useEffect(() => {
    loadComapny();
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

  async function loadComapny() {
    const api = await get(`/v1/platform_admin/companies/${id}`);
    console.log(api);
    if (response.ok) {
      setCompanyData(api.data || {});
      setValue("name", api.data.name);
      setValue("slug", api.data.slug);
      setValue("subscription_id", api.data?.subscription?.id);
      setValue("country_id", api.data?.country?.id);
    }
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

    const api = await put(`/v1/platform_admin/companies/${id}`, body);
    if (response.ok) {
      navigate("/companies");
      toast.success("Company edited successfully");
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
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>Company Logo</label>
                        <div className="mb-2">
                          <img
                            src={companyData?.logo_url || defaultLogo}
                            alt={companyData?.name || "Company logo"}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        </div>
                        <Form.Control
                          type="file"
                          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                          isInvalid={!!errors.logo}
                          {...register("logo")}
                        />
                        <Form.Text className="text-muted">
                          Upload JPG or PNG to replace logo.
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
                          placeholder="Company Name"
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
                        <label>Identifier (No space, No special letter)</label>
                        <Form.Control
                          placeholder="Identifier"
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
                    className="btn custom_theme_button"
                    type="submit"
                    variant="info"
                  >
                    Update
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

export default Edit;
