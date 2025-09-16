export function convertNumber(value?: string | number) {
  return typeof value === "string" ? Number(value.replace(",", ".")) : value
}
