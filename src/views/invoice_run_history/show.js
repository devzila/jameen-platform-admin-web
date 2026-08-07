"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

import useApi from "hooks/useApi";
import { FormShell, DetailList } from "components/ui";

const headerCellStyle = {
  width: "100%",
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
  width: "100%",
  padding: "14px 16px",
  fontSize: "13px",
  color: "#4d5464",
  verticalAlign: "middle",
  borderBottom: "1px solid #f1f4f8",
};

const unitHeaderStyle = {
  ...headerCellStyle,
  whiteSpace: "normal",
  minWidth: "220px",
};

const unitBodyStyle = {
  ...bodyCellStyle,
  whiteSpace: "normal",
  wordBreak: "break-word",
  minWidth: "220px",
  width: "100%",
};

const titleStyle = {
  fontSize: "18px",
  fontWeight: 700,
  color: "#343a40",
  marginBottom: "18px",
};

const tableContainerStyle = {
  width: "100%",
  maxWidth: "100%",
  display: "block",
  maxHeight: "450px",
  overflowY: "auto",
  overflowX: "auto",
  border: "1px solid #e9eef3",
  borderRadius: "10px",
  background: "#ffffff",
};
const tableHeaderStyle = {
  ...headerCellStyle,
  position: "sticky",
  top: 0,
  zIndex: 5,
  background: "#f8fbfc",
};

function pdfAuthHeaders() {
  return {
    Authorization:
      localStorage.getItem("platform_token") ||
      localStorage.getItem("token"),

    "company-slug": window.location.hostname.split(".")[0],

    Accept: "application/pdf",
  };
}


function downloadPdfBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = fileName.endsWith(".pdf")
    ? fileName
    : `${fileName}.pdf`;

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
  return (
    values.find(
      (value) =>
        value !== null &&
        value !== undefined &&
        value !== ""
    ) || "-"
  );
}


function resolveSuccess(result) {
  if (typeof result?.success === "boolean") {
    return result.success;
  }

  if (typeof result?.is_success === "boolean") {
    return result.is_success;
  }

  if (typeof result?.success === "string") {
    return [
      "true",
      "1",
      "yes",
      "y",
      "success",
      "successful",
    ].includes(result.success.toLowerCase());
  }

  if (typeof result?.is_success === "string") {
    return [
      "true",
      "1",
      "yes",
      "y",
      "success",
      "successful",
    ].includes(result.is_success.toLowerCase());
  }

  return false;
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
    result?.unit_contract?.unit_number,
    result?.unit_number,
    result?.unit?.unit_no,
    result?.unit_name,
  ]);

  const buildingName = getFirstValue(result, [
    result?.unit_contract?.unit?.building?.name,
    result?.building?.name,
    result?.building_name,
    result?.unit?.building?.name,
  ]);


  if (unitNo !== "-" && buildingName !== "-") {
    return `${unitNo} (${buildingName})`;
  }

  return unitNo !== "-"
    ? unitNo
    : "-";
}


function formatAmount(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}


function extractResults(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  const candidates = [
    payload?.data,
    payload?.results,
    payload?.data?.results,
    payload?.invoice_results,
    payload?.data?.invoice_results,
  ];

  return candidates.find(Array.isArray) || [];
}


function extractTotalEntries(payload, fallback) {
  return (
    payload?.pagination?.total_entries ??
    payload?.total_entries ??
    payload?.count ??
    fallback
  );
}


function hasHttpError(response) {
  return response?.status >= 400;
}

function InvoiceRunHistoryShow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { get, loading, response } = useApi();
  const [run, setRun] = useState(null);
  const [results, setResults] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);
  function getRunCreatedAt() {
    return (
      run?.created_at ||
      results?.[0]?.created_at ||
      results?.[0]?.invoice?.created_at ||
      "-"
    );
  }

  function getRunFinishedAt() {
    return (
      run?.finished_at ||
      results?.[results.length - 1]?.updated_at ||
      results?.[results.length - 1]?.invoice?.updated_at ||
      "-"
    );
  }
  const [downloadingPdf, setDownloadingPdf] =
    useState(false);
  const endpoint = useMemo(() => {
    if (!id) return null;
    return `/v1/platform_admin/invoice_generation_runs/${id}/results`;
  }, [id]);
  useEffect(() => {
    if (!endpoint) return;
    let cancelled = false;
    async function fetchResults() {
      try {
        const payload = await get(endpoint);
        if (cancelled) return;
        if (hasHttpError(response)) {
          setResults([]);
          setTotalEntries(0);
          return;
        }
        const extractedResults =
          extractResults(payload);
        setResults(extractedResults);
        setTotalEntries(
          extractTotalEntries(
            payload,
            extractedResults.length
          )
        );
        const runData =
          payload?.run ||
          payload?.data?.run ||
          payload?.invoice_generation_run ||
          payload?.data?.invoice_generation_run;


        if (runData) {
          setRun(runData);
        }


      } catch (error) {

        console.error(error);

        setResults([]);

        setTotalEntries(0);

      }

    }


    fetchResults();


    return () => {
      cancelled = true;
    };


  }, [endpoint]);
    async function handleDownloadPdf() {
    if (!id || downloadingPdf || results.length === 0) {
      return;
    }

    setDownloadingPdf(true);

    try {
      const apiResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || ""
        }/v1/platform_admin/invoice_generation_runs/${id}/pdf`,
        {
          method: "GET",
          headers: pdfAuthHeaders(),
        }
      );


      if (!apiResponse.ok) {

        let errorMessage =
          "Unable to download PDF";


        try {
          const body = await apiResponse.json();

          if (body?.message) {
            errorMessage = body.message;
          }

        } catch {}


        if (apiResponse.status === 404) {

          toast.info(
            "PDF download is not available for this run yet."
          );

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


      downloadPdfBlob(
        blob,
        `${run?.property?.name || "invoice-run"}-run-${id}`
      );


    } catch (error) {

      console.error(error);

      toast.error("Unable to download PDF");


    } finally {

      setDownloadingPdf(false);

    }
  }


  return (
    <FormShell
      title="Invoice Run Details"
      subtitle="Read-only view of the selected invoice generation run."
      onBack={() => router.back()}
      actions={
        <Button
          variant="primary"
          onClick={handleDownloadPdf}
          disabled={
            results.length === 0 ||
            downloadingPdf ||
            loading
          }
        >
          {downloadingPdf
            ? "Downloading..."
            : "Download PDF"}
        </Button>
      }
    >
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          display: "block",
        }}
      >
        <DetailList
          items={[
            {
              label: "Run ID",
              value: run?.id || id,
            },
            {
              label: "Started At",
              value: formatDateTime(
                getRunCreatedAt()
              ),
            },
            {
              label: "Finished At",
              value: formatDateTime(
                getRunFinishedAt()
              ),
            },
            {
              label: "Total Results",
              value: totalEntries,
            },
          ]}
        />
      </div>
      <div className="mt-4 w-100">

        <h5 style={titleStyle}>
          Invoice Run Results
        </h5>


        <div style={tableContainerStyle}>

          <Table
            hover
            bordered={false}
            className="listing-table mb-0 w-100"
          >

            <thead>

              <tr>

                <th style={tableHeaderStyle}>
                  Success
                </th>

                <th style={tableHeaderStyle}>
                  Error Code
                </th>

                <th style={tableHeaderStyle}>
                  Error Message
                </th>

                <th
                  style={{
                    ...unitHeaderStyle,
                    ...tableHeaderStyle,
                  }}
                >
                  Unit Number
                  <br />
                  (Building Name)
                </th>

                <th
                  style={{
                    ...tableHeaderStyle,
                    textAlign: "right",
                  }}
                >
                  Invoice Amount
                </th>

                <th
                  style={{
                    ...tableHeaderStyle,
                    textAlign: "right",
                  }}
                >
                  VAT Amount
                </th>

                <th
                  style={{
                    ...tableHeaderStyle,
                    textAlign: "right",
                  }}
                >
                  Total Amount
                </th>

              </tr>

            </thead>


            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                    }}
                  >
                    Loading results...
                  </td>
                </tr>


              ) : results.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                    }}
                  >
                    No results found
                  </td>
                </tr>


              ) : (

                results.map((item, index) => (

                  <tr key={item.id || index}>


                    <td style={bodyCellStyle}>
                      <span
                        style={{
                          padding: "5px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 600,
                          background: resolveSuccess(item)
                            ? "#d1fae5"
                            : "#fee2e2",
                          color: resolveSuccess(item)
                            ? "#047857"
                            : "#dc2626",
                        }}
                      >
                        {resolveSuccess(item)
                          ? "Success"
                          : "Failed"}
                      </span>
                    </td>


                    <td style={bodyCellStyle}>
                      {getErrorCode(item)}
                    </td>


                    <td
                      style={{
                        ...bodyCellStyle,
                        minWidth: "250px",
                      }}
                    >
                      {getErrorMessage(item)}
                    </td>


                    <td style={unitBodyStyle}>
                      {formatUnitLabel(item)}
                    </td>


                    <td
                      style={{
                        ...bodyCellStyle,
                        textAlign: "right",
                        fontWeight: 600,
                      }}
                    >
                      ₹ {formatAmount(
                        getInvoiceAmount(item)
                      )}
                    </td>


                    <td
                      style={{
                        ...bodyCellStyle,
                        textAlign: "right",
                      }}
                    >
                      ₹ {formatAmount(
                        getVatAmount(item)
                      )}
                    </td>


                    <td
                      style={{
                        ...bodyCellStyle,
                        textAlign: "right",
                        fontWeight: 700,
                      }}
                    >
                      ₹ {formatAmount(
                        getTotalAmount(item)
                      )}
                    </td>


                  </tr>

                ))

              )}

            </tbody>

          </Table>

        </div>

      </div>


    </FormShell>
  );

}


InvoiceRunHistoryShow.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};


export default InvoiceRunHistoryShow;