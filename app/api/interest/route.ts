/**
 * Stores an early-access interest signup in Supabase. Runs server-side so
 * the Supabase key never reaches the browser. Duplicate email+kind pairs
 * are ignored; RLS in db/supabase/interest_signups.sql prevents reads.
 *
 * Reads config from process.env, which works on Node runtimes (Vercel) and
 * on Cloudflare Workers with nodejs_compat, where vars are mirrored into
 * process.env.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  const { email, kind } = (body ?? {}) as { email?: unknown; kind?: unknown };
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof kind !== "string" || !kind) {
    return Response.json({ error: "A valid email address is required." }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return Response.json(
      { error: "Signups are not configured yet: set SUPABASE_URL and SUPABASE_ANON_KEY." },
      { status: 503 },
    );
  }

  const response = await fetch(`${url}/rest/v1/interest_signups?on_conflict=email,kind`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal,resolution=ignore-duplicates",
    },
    body: JSON.stringify({ email, kind: kind.slice(0, 80) }),
  });
  if (!response.ok) {
    console.error(`Supabase interest insert failed: ${response.status} ${await response.text()}`);
    return Response.json({ error: "Could not save the signup." }, { status: 502 });
  }

  return Response.json({ ok: true }, { status: 201 });
}
