/**
 * Client-side helper for the early-access interest form. The actual
 * Supabase write happens server-side in app/api/interest/route.ts so no
 * keys are exposed to the browser.
 */
export async function saveInterest(email: string, kind: string): Promise<void> {
  const response = await fetch("/api/interest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, kind }),
  });
  if (!response.ok) {
    const detail = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(detail?.error ?? `Interest signup failed with status ${response.status}`);
  }
}
