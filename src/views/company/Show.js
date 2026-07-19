"use client";

import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import useApi from "hooks/useApi";
import { formatdate } from "services/utility_functions";
import { FormShell, DetailList } from "components/ui";

function Show() {
  const { companyId } = useParams();
  const [company, setCompany] = useState({});
  const { get, response } = useApi();
  const router = useRouter();

  useEffect(() => {
    loadCompany();
  }, []);

  async function loadCompany() {
    const api = await get(`/v1/platform_admin/companies/${companyId}`);
    if (response.ok) {
      setCompany(api.data);
    }
  }

  return (
    <FormShell
      title="Company details"
      subtitle="Read-only view of the selected company."
      onBack={() => router.back()}
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
