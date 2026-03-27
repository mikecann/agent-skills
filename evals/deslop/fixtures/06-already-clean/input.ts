export function getLabel(name?: string) {
  if (!name) return "Anonymous";
  return name;
}

export function isReady(value: unknown) {
  return Boolean(value);
}
