import assert from "node:assert/strict";
import test from "node:test";
import { getDatesAfterLatestRelapse, summarizeRelapses } from "./relapse";

test("getDatesAfterLatestRelapse keeps only check-ins after the latest relapse date", () => {
  const dates = [
    "2026-05-20",
    "2026-05-21",
    "2026-05-22",
    "2026-05-23",
    "2026-05-24",
  ];

  assert.deepEqual(getDatesAfterLatestRelapse(dates, ["2026-05-21", "2026-05-23"]), [
    "2026-05-24",
  ]);
});

test("getDatesAfterLatestRelapse preserves all dates when no relapse exists", () => {
  assert.deepEqual(getDatesAfterLatestRelapse(["2026-05-21", "2026-05-20"], []), [
    "2026-05-20",
    "2026-05-21",
  ]);
});

test("summarizeRelapses counts total, latest date, and top triggers", () => {
  const summary = summarizeRelapses([
    { date: "2026-05-20", trigger: "late_night" },
    { date: "2026-05-21", trigger: "stress" },
    { date: "2026-05-22", trigger: "late_night" },
    { date: "2026-05-23", trigger: "" },
  ]);

  assert.equal(summary.total, 4);
  assert.equal(summary.latestDate, "2026-05-23");
  assert.deepEqual(summary.topTriggers, [
    { trigger: "late_night", count: 2 },
    { trigger: "stress", count: 1 },
  ]);
});
