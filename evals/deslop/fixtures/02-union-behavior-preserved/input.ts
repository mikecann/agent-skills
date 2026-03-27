type Result =
  | { kind: "success"; value: string }
  | { kind: "error"; message: string };

export function getMessage(result: Result) {
  if (result.kind === "success") return result.value;
  return "Something went wrong";
}
