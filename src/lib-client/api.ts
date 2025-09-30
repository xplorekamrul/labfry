export async function api(path: string, init: RequestInit = {}) {
  const res = await fetch(path, {
    method: init.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    body: init.body as BodyInit | null | undefined,
    credentials: "include",              
    cache: "no-store",
  });
  if (!res.ok) {
    let msg = "Request failed";
    try { const data = await res.json(); msg = data.error || msg; } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}
