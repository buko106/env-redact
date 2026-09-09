import { describe, expect, it } from "vitest";
import { collectSecrets, redact } from "./redact.js";

describe("collectSecrets", () => {
  it("picks sensitive keys only, longest first", () => {
    expect(collectSecrets({ API_KEY: "abcdefgh123", PORT: "3000", DB_PASSWORD: "hunter2xx" }))
      .toEqual(["abcdefgh123", "hunter2xx"]);
  });
  it("ignores short values", () => {
    expect(collectSecrets({ TOKEN: "abc" })).toEqual([]);
  });
  it("ignores empty values", () => {
    expect(collectSecrets({ SECRET: "" })).toEqual([]);
  });
});

describe("redact", () => {
  it("masks every occurrence", () => {
    expect(redact("k=abcdefgh123 / abcdefgh123", ["abcdefgh123"])).toBe("k=*** / ***");
  });
  it("supports custom mask", () => {
    expect(redact("x=abcdefgh123", ["abcdefgh123"], "[hidden]")).toBe("x=[hidden]");
  });
});
