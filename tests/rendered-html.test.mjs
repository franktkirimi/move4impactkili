import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the campaign home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>[^<]*Move4Impact[^<]*<\/title>/i);
  assert.match(html, /CLIMB A<br\/>MOUNTAIN\./);
  assert.match(html, /BUILD A HOME\./);
  assert.match(html, /class="campaign-site"/);
  assert.match(html, /id="living-impact"/);
  assert.match(html, /aria-label="Primary navigation"/);
});

test("home page metadata targets the campaign", async () => {
  const html = await (await render()).text();
  assert.match(html, /property="og:title" content="Climb a Mountain\. Build a Home\."/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(
    html,
    /<meta name="description" content="Twenty athletes\. One mountain\. Twelve new homes\./,
  );
  assert.doesNotMatch(html, /Your site is taking shape/);
  assert.doesNotMatch(html, /codex-preview/);
});
