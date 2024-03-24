export function stringToDate(date: string) {
  const timestamp = Date.parse(date);

  if (isNaN(timestamp)) {
    return;
  }

  return new Date(timestamp);
}
