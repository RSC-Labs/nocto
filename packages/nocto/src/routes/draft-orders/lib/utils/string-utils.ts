export function pluralize(count: number, plural: string, singular: string) {
  return count === 1 ? singular : plural
}
