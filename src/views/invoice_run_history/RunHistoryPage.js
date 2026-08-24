"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import useApi from "hooks/useApi";
import { Form } from "react-bootstrap";
import { FaCalendarAlt, FaFileAlt, FaPen } from "react-icons/fa";
import Loader from "components/Loader";
import {
  PageShell,
  PageHeader,
  ContentCard,
  DataTable,
  EmptyState,
  StatusBadge,
} from "components/ui";

const TABS = [
  {
    href: "/invoice-run-history",
    label: "Scheduled Invoice Run",
    icon: FaCalendarAlt,
  },
  {
    href: "/templated-invoice-run-history",
    label: "Templated Invoice Run",
    icon: FaFileAlt,
  },
  {
    href: "/custom-invoice-run-history",
    label: "Custom Invoice Run",
    icon: FaPen,
  },
];

const COLUMNS = [
  { key: "property", label: "Property" },
  { key: "started", label: "Started at" },
  { key: "finished", label: "Finished at" },
  { key: "status", label: "Status" },
  { key: "processed", label: "Processed" },
  { key: "success", label: "Success" },
  { key: "failure", label: "Failure" },
  { key: "billing_from", label: "Billing from" },
  { key: "billing_to", label: "Billing to" },
  { key: "next_run", label: "Next run" },
];

function statusTone(status) {
  if (status === "completed") return "success";
  if (status === "failed" || status === "error") return "danger";
  if (
    status === "running" ||
    status === "in_progress" ||
    status === "processing"
  ) {
    return "warning";
  }
  return "muted";
}

function RunHistoryPage({
  title,
  subtitle,
  endpoint,
  activePath,
  emptyTitle = "No invoice run history found",
  emptyText = "Try a different company filter.",
}) {
  const { get, loading } = useApi();
  const [runs, setRuns] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");

  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany, endpoint]);

  const fetchCompanies = async () => {
    try {
      const response = await get(
        "/v1/platform_admin/companies?status=active"
      );
      setCompanies(response?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    let url = endpoint;
    if (selectedCompany) {
      url += `?company_id=${selectedCompany}`;
    }

    try {
      const response = await get(url);
      setRuns(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      setRuns([]);
    }
  };

  return (
    <PageShell className="admin-page--wide">
      <PageHeader
        title={title}
        subtitle={
          subtitle ||
          `${runs.length} total record${runs.length === 1 ? "" : "s"}`
        }
        actions={
          <div className="admin-field mb-0" style={{ minWidth: 220 }}>
            <label htmlFor="run-history-company">Company</label>
            <Form.Control
              id="run-history-company"
              as="select"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="">All companies</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Form.Control>
          </div>
        }
      />

      <ContentCard flush>
        <nav className="admin-tabs" aria-label="Invoice run history">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.href === activePath;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`admin-tabs__link${isActive ? " is-active" : ""}`}
              >
                <Icon className="admin-tabs__icon" aria-hidden />
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <DataTable
          columns={COLUMNS}
          loading={loading && !runs.length ? <Loader /> : null}
          colSpan={COLUMNS.length}
          empty={
            <EmptyState
              colSpan={COLUMNS.length}
              title={emptyTitle}
              text={emptyText}
            />
          }
        >
          {runs.length > 0
            ? runs.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="cell-title">
                      {item?.property?.name || "-"}
                    </div>
                  </td>
                  <td className="cell-muted">{item.started_at || "-"}</td>
                  <td className="cell-muted">{item.finished_at || "-"}</td>
                  <td>
                    <StatusBadge
                      label={item.status || "Unknown"}
                      tone={statusTone(item.status)}
                    />
                  </td>
                  <td className="cell-muted">
                    {item.contracts_processed || 0}
                  </td>
                  <td className="cell-muted">{item.success_count || 0}</td>
                  <td className="cell-muted">{item.failure_count || 0}</td>
                  <td className="cell-muted">
                    {item.billing_period_from || "-"}
                  </td>
                  <td className="cell-muted">
                    {item.billing_period_to || "-"}
                  </td>
                  <td className="cell-muted">{item.next_run_date || "-"}</td>
                </tr>
              ))
            : null}
        </DataTable>
      </ContentCard>
    </PageShell>
  );
}

export default RunHistoryPage;
