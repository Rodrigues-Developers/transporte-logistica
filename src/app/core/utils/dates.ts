export function stringToDate(date: string) {
  const timestamp = Date.parse(date);

  if (isNaN(timestamp)) {
    throw new Error("Invalid date string. Please provide a valid date string.");
  }

  return new Date(timestamp);
}
