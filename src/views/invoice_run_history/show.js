"use client";

import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Button, Table } from "react-bootstrap";
import CIcon from "@coreui/icons-react";
import { cilCloudDownload, freeSet } from "@coreui/icons";
import { toast } from "react-toastify";
import useApi from "hooks/useApi";

const THEME_COLOR = "#00bfcc";

const headerCellStyle = {
  background: "#f8fbfc",
  padding: "12px 16px",
  fontSize: "12px",
  fontWeight: 700,
  textTransform: "uppercase",
  color: "#6c757d",
  whiteSpace: "nowrap",
  borderBottom: "1px solid #e9eef3",
};

const bodyCellStyle = {
  padding: "14px 16px",
  fontSize: "13px",
  color: "#4d5464",
  verticalAlign: "middle",
  borderBottom: "1px solid #f1f4f8",
};

const unitHeaderStyle = {
  ...headerCellStyle,
  whiteSpace: "normal",
  minWidth: "240px",
};

const unitBodyStyle = {
  ...bodyCellStyle,
  whiteSpace: "normal",
  wordBreak: "break-word",
  minWidth: "240px",
};

function pdfAuthHeaders() {
  return {
    Authorization: localStorage.getItem("platform_token") || localStorage.getItem("token"),
    "company-slug": window.location.hostname.split(".")[0],
    Accept: "application/pdf",
  };
}

function downloadPdfBlob(blob, fileName) {
  const safeName = String(fileName || "invoice-run").trim();
  const downloadName = safeName.toLowerCase().endsWith(".pdf") ? safeName : `${safeName}.pdf`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = downloadName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getFirstValue(result, values) {
  return values.find((value) => value !== null && value !== undefined && value !== "") || "-";
}

function resolveSuccess(result) {
  if (typeof result?.success === "boolean") return result.success;
  if (typeof result?.is_success === "boolean") return result.is_success;
  if (typeof result?.success === "string") {
    const normalized = result.success.toLowerCase();
    return ["true", "1", "yes", "y", "success", "successful"].includes(normalized);
  }
  if (typeof result?.is_success === "string") {
    const normalized = result.is_success.toLowerCase();
    return ["true", "1", "yes", "y", "success", "successful"].includes(normalized);
  }
  return Boolean(result?.success || result?.is_success);
}

function getErrorCode(result) {
  return getFirstValue(result, [
    result?.error_code,
    result?.error?.code,
    result?.error?.error_code,
    result?.response?.error_code,
    result?.response?.code,
  ]);
}

function getErrorMessage(result) {
  return getFirstValue(result, [
    result?.error_message,
    result?.error?.message,
    result?.error?.error_message,
    result?.response?.error_message,
    result?.response?.message,
  ]);
}

function getInvoiceAmount(result) {
  return getFirstValue(result, [
    result?.invoice?.amount,
    result?.invoice?.invoice_amount,
    result?.invoice_amount,
    result?.amount,
  ]);
}

function getVatAmount(result) {
  return getFirstValue(result, [
    result?.invoice?.vat_amount,
    result?.invoice?.vat,
    result?.vat_amount,
    result?.vat,
  ]);
}

function getTotalAmount(result) {
  return getFirstValue(result, [
    result?.invoice?.total_amount,
    result?.invoice?.total,
    result?.total_amount,
    result?.total,
  ]);
}

function formatUnitLabel(result) {
  const unitNo = getFirstValue(result, [
    result?.unit_contract?.unit?.unit_no,
    result?.unit_contract?.unit?.number,
    result?.unit_contract?.unit_number,
    result?.unit_contract?.unit?.unit_number,
    result?.unit_number,
    result?.unit_no,
    result?.unit?.unit_no,
    result?.unit?.number,
    result?.unit_name,
    result?.unit_identifier,
    result?.contract_unit_no,
    result?.unit_contract_id,
  ]);

  const buildingName = getFirstValue(result, [
    result?.unit_contract?.unit?.building?.name,
    result?.unit_contract?.building?.name,
    result?.building?.name,
    result?.building_name,
    result?.building?.building_name,
    result?.unit?.building?.name,
    result?.property?.name,
  ]);

  const details = [unitNo, buildingName].filter((value) => value && value !== "-");

  if (details.length > 0) {
    return details.join(" • ");
  }

  if (result?.invoice_id) {
    return `Invoice #${result.invoice_id}`;
  }

  return "-";
}

function formatAmount(value) {
  if (value === null || value === undefined || value === "") return "-";

  if (typeof value === "number") {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  if (typeof value === "string" && /^[-+]?\d+(\.\d+)?$/.test(value.trim())) {
    const numberValue = Number(value);
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numberValue);
  }

  return value;
}

function successBadgeStyle(success) {
  const colors = success
    ? { bg: "#e6f9ec", color: "#1a9e54" }
    : { bg: "#fdeaea", color: "#e03131" };
  return {
    background: colors.bg,
    color: colors.color,
    padding: "4px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600,
    display: "inline-block",
  };
}

function extractResults(payload, fallbackRun) {
  if (Array.isArray(payload)) {
    return payload;
  }

  const candidates = [
    payload?.data,
    payload?.results,
    payload?.data?.results,
    payload?.result,
    payload?.data?.result,
    payload?.invoice_results,
    payload?.data?.invoice_results,
    fallbackRun?.results,
    fallbackRun?.invoice_results,
  ];

  const result = candidates.find((item) => Array.isArray(item));

  return result || [];
}


function extractTotalEntries(payload, fallbackCount) {
  const value =
    payload?.pagination?.total_entries ??
    payload?.total_entries ??
    payload?.total ??
    payload?.count ??
    payload?.data?.total_entries;

  return typeof value === "number"
    ? value
    : fallbackCount;
}


function hasResultPayload(payload, fallbackRun) {
  return Boolean(
    Array.isArray(payload) ||
    Array.isArray(payload?.data) ||
    Array.isArray(payload?.results) ||
    Array.isArray(payload?.data?.results) ||
    Array.isArray(payload?.result) ||
    Array.isArray(payload?.data?.result) ||
    Array.isArray(payload?.invoice_results) ||
    Array.isArray(payload?.data?.invoice_results) ||
    Array.isArray(fallbackRun?.results) ||
    Array.isArray(fallbackRun?.invoice_results)
  );
}


function hasHttpError(response) {
  return response?.status >= 400;
}

export default function InvoiceRunResultsModal({ run, resultsEndpoint, onClose }) {
  const [results, setResults] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const { get, loading, response } = useApi();

  const endpoint = useMemo(() => {
    if (!run?.id) return null;
    return `${resultsEndpoint}/${run.id}/results`;
  }, [resultsEndpoint, run?.id]);

  const fallbackEndpoint = useMemo(() => {
    if (!run?.id) return null;
    return `${resultsEndpoint}/${run.id}`;
  }, [resultsEndpoint, run?.id]);

  useEffect(() => {
    if (!endpoint) return;

    let cancelled = false;

    const fetchResults = async () => {
      const candidateEndpoints = [endpoint, fallbackEndpoint].filter(Boolean);

      for (const candidate of candidateEndpoints) {
        try {
          const payload = await get(candidate);

          if (!cancelled && hasHttpError(response)) {
            if (candidate === candidateEndpoints[candidateEndpoints.length - 1]) {
              setResults([]);
              setTotalEntries(0);
            }
            continue;
          }

          const extractedResults = extractResults(payload, run);

          if (!cancelled) {
            if (extractedResults.length > 0 || hasResultPayload(payload, run)) {
              setResults(extractedResults);
              setTotalEntries(extractTotalEntries(payload, extractedResults.length));
            } else {
              setResults([]);
              setTotalEntries(0);
            }
          }

          return;
        } catch {
          if (!cancelled) {
            setResults([]);
            setTotalEntries(0);
          }
          return;
        }
      }

      if (!cancelled) {
        setResults([]);
        setTotalEntries(0);
      }
    };

    fetchResults();

    return () => {
      cancelled = true;
    };
  }, [endpoint, fallbackEndpoint, get, response, run]);

  async function handleDownloadPdf() {
    if (!run?.id || downloadingPdf || loading || results.length === 0) return;

    setDownloadingPdf(true);
    try {
      const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/v1/platform_admin/invoice_generation_runs/${run.id}/pdf`, {
        method: "GET",
        headers: pdfAuthHeaders(),
      });

      if (!apiResponse.ok) {
        let errorMessage = "Unable to download PDF";
        try {
          const errorBody = await apiResponse.json();
          if (errorBody?.message) {
            errorMessage = errorBody.message;
          }
        } catch {
          // keep default message when response is not JSON
        }
        if (apiResponse.status === 404) {
          toast.info("PDF download is not available for this run yet.");
        } else {
          toast.error(errorMessage);
        }
        return;
      }

      const blob = await apiResponse.blob();
      if (!blob.size) {
        toast.error("PDF is empty");
        return;
      }

      const propertyName = run?.property?.name || "invoice-run";
      downloadPdfBlob(blob, `${propertyName}-run-${run.id}`);
    } catch {
      toast.error("Unable to download PDF");
    } finally {
      setDownloadingPdf(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1050,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "rgba(15, 23, 42, 0.45)",
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        style={{
          position: "relative",
          width: "min(100%, 1200px)",
          maxWidth: "calc(100vw - 48px)",
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${THEME_COLOR} 0%, #0098a3 100%)`,
            border: "none",
            padding: "20px 24px",
            borderTopLeftRadius: "inherit",
            borderTopRightRadius: "inherit",
          }}
        >
          <div className="w-100" style={{ color: "#fff" }}>
            <div className="d-flex align-items-center justify-content-between" style={{ gap: "14px" }}>
              <div className="d-flex align-items-center" style={{ gap: "14px", minWidth: 0 }}>
                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <CIcon icon={freeSet.cilList} size="lg" />
                </div>
                <div className="d-flex flex-column" style={{ minWidth: 0 }}>
                  <span className="text-capitalize" style={{ fontSize: "18px", fontWeight: 700, lineHeight: 1.2 }}>
                    {run?.property?.name || "Invoice Run Results"}
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: 400, opacity: 0.9 }}>
                    Run #{run?.id} · {totalEntries} results
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: 400, opacity: 0.9, marginTop: "2px" }}>
                    Started: {formatDateTime(run?.started_at)} · Finished: {formatDateTime(run?.finished_at)}
                  </span>
                </div>
              </div>

              <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                <button
                  type="button"
                  className="btn border-0 d-flex align-items-center justify-content-center"
                  onClick={handleDownloadPdf}
                  disabled={results.length === 0 || downloadingPdf || loading}
                  title={downloadingPdf ? "Downloading PDF…" : results.length > 0 ? "Download PDF" : "No results to download"}
                  aria-label={downloadingPdf ? "Downloading PDF" : "Download PDF"}
                  aria-busy={downloadingPdf}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.2)",
                    color: "#fff",
                    flexShrink: 0,
                    opacity: results.length === 0 || loading ? 0.45 : 1,
                    cursor: results.length === 0 || downloadingPdf || loading ? "not-allowed" : "pointer",
                  }}
                >
                  {downloadingPdf ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: "1.1rem", height: "1.1rem", borderWidth: "0.15em" }} />
                  ) : (
                    <CIcon icon={cilCloudDownload} />
                  )}
                </button>

                <button
                  type="button"
                  className="btn border-0 d-flex align-items-center justify-content-center"
                  onClick={onClose}
                  aria-label="Close"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.2)",
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  <span aria-hidden="true" style={{ fontSize: "20px", lineHeight: 1 }}>
                    ×
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: 0, maxHeight: "70vh", overflowY: "auto", background: "#fff" }}>
          <style>{`
            .invoice-run-results-table tbody tr { transition: background-color .15s ease; }
            .invoice-run-results-table tbody tr:hover { background-color: #f5fdfe; }
            .invoice-run-results-table thead th { position: sticky; top: 0; z-index: 1; }
          `}</style>

          <div className="table-responsive" style={{ minHeight: "280px" }}>
            <table className="table listing-table invoice-run-results-table mb-0" style={{ borderCollapse: "collapse", minHeight: "280px", marginBottom: 0 }}>
              <thead>
                <tr>
                  <th style={headerCellStyle}>Success</th>
                  <th style={headerCellStyle}>Error Code</th>
                  <th style={headerCellStyle}>Error Message</th>
                  <th style={unitHeaderStyle}>Unit Number (Building Name)</th>
                  <th style={headerCellStyle}>Invoice Amount</th>
                  <th style={headerCellStyle}>VAT Amount</th>
                  <th style={headerCellStyle}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {results.length > 0 ? (
                  results.map((result) => (
                    <tr key={result.id || `${result.invoice_id || "result"}-${index}`}>
                      <td style={bodyCellStyle}>
                        <span style={successBadgeStyle(resolveSuccess(result))}>{resolveSuccess(result) ? "Yes" : "No"}</span>
                      </td>
                      <td style={bodyCellStyle} className="text-capitalize">{getErrorCode(result)}</td>
                      <td style={bodyCellStyle}>{getErrorMessage(result)}</td>
                      <td style={unitBodyStyle}>{formatUnitLabel(result)}</td>
                      <td style={bodyCellStyle}>{formatAmount(getInvoiceAmount(result))}</td>
                      <td style={bodyCellStyle}>{formatAmount(getVatAmount(result))}</td>
                      <td style={bodyCellStyle}>{formatAmount(getTotalAmount(result))}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ padding: 0 }}>
                      <div
                        className="d-flex align-items-center justify-content-center text-secondary fst-italic"
                        style={{ minHeight: "220px", padding: "32px" }}
                      >
                        {loading ? "Loading results..." : "No results found"}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #eef1f5", padding: "16px 24px", background: "#fff", display: "flex", justifyContent: "flex-end" }}>
          <Button variant="light" onClick={onClose} style={{ borderRadius: "8px", fontWeight: 600, border: "1px solid #e6ebf1", padding: "8px 16px" }}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

InvoiceRunResultsModal.propTypes = {
  run: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    started_at: PropTypes.string,
    finished_at: PropTypes.string,
    property: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  resultsEndpoint: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
