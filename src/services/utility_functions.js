export function formatdate(isoDate) {
  if (isoDate) {
    const date = new Date(isoDate);
    const options = { day: "2-digit", month: "short", year: "numeric" };

    const formatted_date = date.toLocaleDateString("en-US", options) || "-";

    return formatted_date;
  } else {
    return null;
  }
}
