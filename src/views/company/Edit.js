import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import useFetch from "use-http";
import AppDataContext from "contexts/AppDataContext";
import Select from "react-select";


// react-bootstrap components
import {
  Button,
  Card,
  Form,
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
  const { get, put, response } = useFetch();
  const appData = useContext(AppDataContext);
  const navigate = useNavigate();

  const [companyData, setCompanyData] = useState({});
  const [country_array, setCountry_array] = useState([]);
  const [imageView, setImageView] = useState("");
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
  }, []);

  const handleFileSelection = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const base64Result = e.target.result;
        setImageView(base64Result);
      };

      reader.readAsDataURL(selectedFile);
    }
  };

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
      setCompanyData(api.data);

      setValue("name", api.data.name);
      setValue("slug", api.data.slug);
      setValue("subscription_id", api.data?.subscription?.id);
      setValue("country_id", api.data?.country?.id);
    }
  }

  async function onSubmit(data) {
    const body = {
      ...data,
      logo: {
        data: imageView,
      },
    };

    const api = await put(`/v1/platform_admin/companies/${id}`, {
      company: body,
    });

    if (response.ok) {
      navigate("/companies");
      toast.success("Company edited successfully");
    } else {
      if (response.status === 422 && response.data?.errors) {
        Object.entries(response.data.errors).forEach(
          ([field, fieldErrors]) => {
            if (Array.isArray(fieldErrors) && fieldErrors.length) {
              setError(field, {
                type: "server",
                message: fieldErrors[0],
              });
            }
          }
        );
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

                  {/* Logo Preview */}
                  <Row>
                    <div className="col text-center mb-4">
                      <img
                        alt="Company Logo"
                        style={{
                          width: "200px",
                          height: "200px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                        className="img-circle img-thumbnail"
                        src={
                          imageView
                            ? imageView
                            : companyData?.logo
                            ? companyData.logo
                            : defaultbuilding
                        }
                      />
                    </div>
                  </Row>

                  {/* Logo Upload */}
                  <Row>
                    <Col className="pr-1 mt-3" md="12">
                      <Form.Group>
                        <label>Company Logo</label>

                        <Form.Control
                          type="file"
                          accept=".jpg, .jpeg, .png"
                          {...register("logo")}
                          onChange={(e) => handleFileSelection(e)}
                        />
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
                        />

                        <Form.Control.Feedback type="invalid">
                          {errors.name?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col className="pr-1" md="12">
                      <Form.Group>
                        <label>
                          Identifier (No space, No special letter)
                        </label>

                        <Form.Control
                          placeholder="Identifier"
                          type="text"
                          isInvalid={!!errors.slug}
                          {...register("slug")}
                        />

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
                              onChange={(val) =>
                                field.onChange(val.value)
                              }
                              placeholder="Select Subscription"
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
                              onChange={(val) =>
                                field.onChange(val.value)
                              }
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