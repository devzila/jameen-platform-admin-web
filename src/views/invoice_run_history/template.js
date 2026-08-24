"use client";

import RunHistoryPage from "./RunHistoryPage";

function TemplatedInvoiceRunHistory() {
  return (
    <RunHistoryPage
      title="Templated Invoice Run"
      subtitle="History of templated invoice generation runs across companies."
      endpoint="/v1/platform_admin/invoice_generation_runs/templated_run_history"
      activePath="/templated-invoice-run-history"
      emptyTitle="No templated runs found"
      emptyText="Try a different company filter or check back after the next templated run."
    />
  );
}

export default TemplatedInvoiceRunHistory;
