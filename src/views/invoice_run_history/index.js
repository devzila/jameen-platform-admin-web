"use client";

import RunHistoryPage from "./RunHistoryPage";

function InvoiceRunHistory() {
  return (
    <RunHistoryPage
      title="Scheduled Invoice Run"
      subtitle="History of scheduled invoice generation runs across companies."
      endpoint="/v1/platform_admin/invoice_generation_runs/scheduled_run_history"
      activePath="/invoice-run-history"
      emptyTitle="No scheduled runs found"
      emptyText="Try a different company filter or check back after the next scheduled run."
    />
  );
}

export default InvoiceRunHistory;
