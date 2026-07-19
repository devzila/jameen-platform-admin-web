"use client";

import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import useApi from "hooks/useApi";
import { formatdate } from "services/utility_functions";
import { FormShell, DetailList } from "components/ui";

function Show() {
  const { companyId, userId } = useParams();
  const [user, setUser] = useState({});
  const { get, response } = useApi();
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const api = await get(
      `/v1/platform_admin/companies/${companyId}/users/${userId}`
    );
    if (response.ok) {
      setUser(api.data);
    }
  }

  return (
    <FormShell
      title="User details"
      subtitle="Read-only view of the selected user."
      onBack={() => router.back()}
    >
      <DetailList
        items={[
          { label: "Name", value: user.name },
          { label: "Email", value: user.email },
          { label: "Phone", value: user.mobile_number },
          { label: "Created at", value: formatdate(user.created_at) },
        ]}
      />
    </FormShell>
  );
}

export default Show;
