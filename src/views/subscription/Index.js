"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useApi from "hooks/useApi";
import Paginate from "../../components/Paginate";
import { BsThreeDots } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import CustomDivToggle from "../../components/CustomDivToggle";
import Loader from "components/Loader";
import dateFormat from "../../utilities/DateFormat";
import {
  PageShell,
  PageHeader,
  ContentCard,
  SearchInput,
  AdminButton,
  DataTable,
  EmptyState,
} from "components/ui";

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "units", label: "Max units" },
  { key: "compounds", label: "Max compounds" },
  { key: "created", label: "Created" },
  { key: "action", label: "Action" },
];

function Index() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { get, response, loading } = useApi();
  const router = useRouter();

  useEffect(() => {
    const delay = setTimeout(() => {
      loadInitialSubscriptions();
    }, 300);
    return () => clearTimeout(delay);
  }, [currentPage, searchKeyword]);

  async function loadInitialSubscriptions() {
    let endpoint = `/v1/platform_admin/subscriptions?page=${currentPage}`;

    if (searchKeyword) {
      endpoint += `&q[name_cont]=${searchKeyword}`;
    }
    const initialSubscriptions = await get(endpoint);

    if (response.ok) {
      setSubscriptions(initialSubscriptions.data || []);
      setPagination(initialSubscriptions.pagination || null);
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1);
  }

  return (
    <PageShell>
      <PageHeader
        title="Subscriptions"
        subtitle="Define plans and capacity limits for tenant companies."
        actions={
          <>
            <SearchInput
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(1);
              }}
              onSearch={loadInitialSubscriptions}
              placeholder="Search subscriptions..."
            />
            <AdminButton onClick={() => router.push("/subscriptions/add")}>
              Add Subscription
            </AdminButton>
          </>
        }
      />

      <ContentCard flush>
        <DataTable
          columns={COLUMNS}
          loading={loading && !subscriptions.length ? <Loader /> : null}
          colSpan={COLUMNS.length}
          empty={
            <EmptyState
              colSpan={COLUMNS.length}
              title="No subscriptions found"
              text="Create a subscription plan to get started."
            />
          }
        >
          {subscriptions.length > 0
            ? subscriptions.map((subscription) => (
                <tr key={subscription.id}>
                  <td>
                    <div className="cell-title">{subscription.name}</div>
                  </td>
                  <td className="cell-muted">
                    {subscription.max_no_of_units}
                  </td>
                  <td className="cell-muted">
                    {subscription.max_no_of_compounds}
                  </td>
                  <td className="cell-muted">
                    {subscription.created_at
                      ? dateFormat(subscription.created_at.substring(0, 10))
                      : "-"}
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        as={CustomDivToggle}
                        style={{ cursor: "pointer" }}
                      >
                        <BsThreeDots />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          as={Link}
                          href={`/subscriptions/${subscription.id}/edit`}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          as={Link}
                          href={`/subscriptions/${subscription.id}`}
                        >
                          Show
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))
            : null}
        </DataTable>
      </ContentCard>

      {pagination?.total_pages > 1 ? (
        <Paginate
          onPageChange={handlePageClick}
          pageRangeDisplayed={pagination.per_page}
          pageCount={pagination.total_pages}
          forcePage={currentPage - 1}
        />
      ) : null}
    </PageShell>
  );
}

export default Index;
