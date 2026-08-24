"use client";

import RunHistoryPage from "./RunHistoryPage";

function CustomInvoiceRunHistory() {
  return (
    <RunHistoryPage
      title="Custom Invoice Run"
      subtitle="History of custom invoice generation runs across companies."
      endpoint="/v1/platform_admin/invoice_generation_runs/custom_run_history"
      activePath="/custom-invoice-run-history"
      emptyTitle="No custom runs found"
      emptyText="Try a different company filter or check back after the next custom run."
    />
  );
}

export default CustomInvoiceRunHistory;
