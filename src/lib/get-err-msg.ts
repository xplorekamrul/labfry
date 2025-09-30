export type ErrorLike = { message: string };

export function isErrorLike(x: unknown): x is ErrorLike {
  return (
    typeof x === "object" &&
    x !== null &&
    "message" in x &&
    typeof (x as Record<string, unknown>).message === "string"
  );
}

export function getErrMsg(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (isErrorLike(e)) return e.message;
  try { return JSON.stringify(e); } catch { return String(e); }
}
