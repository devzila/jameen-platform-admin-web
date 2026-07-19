import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import useFetch from "use-http";
import Select from "react-select";
import defaultLogo from "assets/img/jameen-logo.png";
import { Form } from "react-bootstrap";
import { FormShell, AdminButton } from "components/ui";

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

    await put(`/v1/platform_admin/companies/${id}`, body);
    if (response.ok) {
      navigate("/companies");
      toast.success("Company edited successfully");
    } else if (response.status === 422 && response.data?.errors) {
      Object.entries(response.data.errors).forEach(([field, fieldErrors]) => {
        if (Array.isArray(fieldErrors) && fieldErrors.length) {
          setError(field, { type: "server", message: fieldErrors[0] });
        }
      });
    } else {
      toast.error(response.data?.message);
    }
  }

  return (
    <FormShell
      title="Edit Company"
      subtitle="Update company details, branding, and plan assignment."
      onBack={() => navigate(-1)}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-field">
          <Form.Label>Company Logo</Form.Label>
          <div className="admin-form-preview">
            <img
              src={companyData?.logo_url || defaultLogo}
              alt={companyData?.name || "Company logo"}
            />
          </div>
          <Form.Control
            type="file"
            accept="image/jpeg,image/png,.jpg,.jpeg,.png"
            isInvalid={!!errors.logo}
            {...register("logo")}
          />
          <Form.Text>Upload JPG or PNG to replace logo.</Form.Text>
          <Form.Control.Feedback type="invalid">
            {errors.logo?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-field">
          <Form.Label>Name</Form.Label>
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

        <Form.Group className="mb-field">
          <Form.Label>Identifier</Form.Label>
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

        <Form.Group className="mb-field">
          <Form.Label>Subscription</Form.Label>
          <Controller
            name="subscription_id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={subscriptionPlans}
                value={subscriptionPlans.find((c) => c.value === field.value)}
                onChange={(val) => field.onChange(val.value)}
                placeholder="Select subscription"
              />
            )}
          />
          {errors.subscription_id ? (
            <div className="text-danger mt-1">
              {errors.subscription_id.message}
            </div>
          ) : null}
        </Form.Group>

        <Form.Group className="mb-field">
          <Form.Label>Country</Form.Label>
          <Controller
            name="country_id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={country_array}
                value={country_array.find((c) => c.value === field.value)}
                onChange={(val) => field.onChange(val.value)}
                placeholder="Select country"
              />
            )}
          />
          {errors.country_id ? (
            <div className="text-danger mt-1">{errors.country_id.message}</div>
          ) : null}
        </Form.Group>

        <AdminButton type="submit">Update</AdminButton>
      </Form>
    </FormShell>
  );
}

export default Edit;
