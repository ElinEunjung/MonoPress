export function formatNorwegianDate(value: Date, errorMessage = "") {
  const result = new Intl.DateTimeFormat("no").format(new Date(value));

  if (result === "1.1.1970") {
    return errorMessage;
  }

  return result;
}
