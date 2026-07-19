import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "use-http";
import { formatdate } from "services/utility_functions";
import { FormShell, DetailList } from "components/ui";

function Show() {
  const { id } = useParams();
  const [company, setCompany] = useState({});
  const { get, response } = useFetch();
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

  return (
    <FormShell
      title="Company details"
      subtitle="Read-only view of the selected company."
      onBack={() => navigate(-1)}
    >
      <DetailList
        items={[
          { label: "Name", value: company.name },
          { label: "Slug", value: company.slug },
          { label: "Created at", value: formatdate(company.created_at) },
        ]}
      />
    </FormShell>
  );
}

export default Show;
