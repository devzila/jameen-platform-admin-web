export function formatdate(isoDate) {
  if (isoDate) 
  {
    const date = new Date(isoDate);

    // invalid date check
  if (isNaN(date)) return "-";

    const options = {
      month: "short",   
      day: "2-digit",   
      year: "numeric",  
    };

    const formatted_date =
      date.toLocaleDateString("en-US", options) || "-";

    return formatted_date;
  } else {
    return "-";
  }
}

export function format_react_select(data, key) {
  if (data) {
    return data.map((e) => ({
      value: e[key[0]],
      label: e[key[1]],
    }));
  } else {
    return [];
  }
}