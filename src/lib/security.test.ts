import assert from "node:assert/strict";
import test from "node:test";
import { isMutatingMethod, isSameOriginRequest } from "./security";

test("isMutatingMethod flags write methods", () => {
  assert.equal(isMutatingMethod("POST"), true);
  assert.equal(isMutatingMethod("PUT"), true);
  assert.equal(isMutatingMethod("PATCH"), true);
  assert.equal(isMutatingMethod("DELETE"), true);
  assert.equal(isMutatingMethod("GET"), false);
  assert.equal(isMutatingMethod("HEAD"), false);
  assert.equal(isMutatingMethod("OPTIONS"), false);
});

test("isSameOriginRequest accepts same-origin origin headers", () => {
  assert.equal(
    isSameOriginRequest("https://example.com/api/checkin", "https://example.com", null),
    true
  );
});

test("isSameOriginRequest rejects cross-site origin headers", () => {
  assert.equal(
    isSameOriginRequest("https://example.com/api/checkin", "https://evil.test", null),
    false
  );
});

test("isSameOriginRequest falls back to referer when origin is absent", () => {
  assert.equal(
    isSameOriginRequest(
      "https://example.com/api/checkin",
      null,
      "https://example.com/dashboard"
    ),
    true
  );
  assert.equal(
    isSameOriginRequest(
      "https://example.com/api/checkin",
      null,
      "https://evil.test/page"
    ),
    false
  );
});
