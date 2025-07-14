export function getFormattedDate(date: Date, format: string = "YYYY-MM-DD") {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  return format
    .replace("DD", day)
    .replace("MM", month)
    .replace("YYYY", year)
    .replace("YY", year.substring(2));
}

export function generateCSV(
  header: string[] = [],
  data: (string | number)[][] = [],
  name = "data"
) {
  let csv = header.join(",") + "\n";
  data.forEach(function (row) {
    csv += row.join(",");
    csv += "\n";
  });

  const hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  hiddenElement.target = "_blank";
  hiddenElement.download = name + ".csv";
  hiddenElement.click();
}

/**
 * @param func - The function to debounce.
 * @param timeout - Delay in milliseconds (default: 300ms).
 * @returns A debounced function.
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  timeout = 300
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

/**
 * Opens given url url in a new tab
 * @param {string} url
 * @return {void}
 */
export function openInNewTab(url: string): void {
  Object.assign(document.createElement("a"), {
    target: "_blank",
    href: url,
  }).click();
}

const minDate = new Date();
export const formattedDate = minDate.toISOString().split("T")[0];
