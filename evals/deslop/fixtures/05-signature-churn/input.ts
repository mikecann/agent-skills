export function getCount(result: any) {
  return result.items!.length;
}

export function getSummary(result: any) {
  if (result.ok) return result.value;
  return null;
}
