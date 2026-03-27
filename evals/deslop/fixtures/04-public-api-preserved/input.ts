export function buildUserSummary(
  id: string,
  name: string,
  isPriority: boolean,
) {
  return [id, `${name}-${isPriority ? "priority" : "normal"}`] as const;
}

export function getRetryDelay(timeout: number, shouldDouble: boolean) {
  let finalTimeout = timeout;

  if (shouldDouble) {
    finalTimeout = timeout * 2;
  } else {
    finalTimeout = timeout;
  }

  return finalTimeout;
}
