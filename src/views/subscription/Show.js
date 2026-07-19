"use client";

import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import useApi from "hooks/useApi";
import { formatdate } from "services/utility_functions";
import { FormShell, DetailList } from "components/ui";

function Show() {
  const { id } = useParams();
  const [subscription, setSubscription] = useState({});
  const { get, response } = useApi();
  const router = useRouter();

  useEffect(() => {
    loadSubscription();
  }, []);

  async function loadSubscription() {
    const api = await get(`/v1/platform_admin/subscriptions/${id}`);
    if (response.ok) {
      setSubscription(api.data);
    }
  }

  return (
    <FormShell
      title="Subscription details"
      subtitle="Read-only view of the selected subscription plan."
      onBack={() => router.back()}
    >
      <DetailList
        items={[
          { label: "Name", value: subscription.name },
          { label: "Max units", value: subscription.max_no_of_units },
          { label: "Max compounds", value: subscription.max_no_of_compounds },
          { label: "Created at", value: formatdate(subscription.created_at) },
        ]}
      />
    </FormShell>
  );
}

export default Show;
