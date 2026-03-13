import { describe, expect, test } from "bun:test";

import { redactSecrets, SECRET_PATTERNS } from "./secretPatterns";

describe("redactSecrets", () => {
  describe("OpenAI", () => {
    test("redacts project API keys", () => {
      const input = "sk-proj-abcdefghijklmnopqrstuvwxyz1234567890";
      expect(redactSecrets(input)).toBe("[REDACTED]");
    });

    test("redacts legacy API keys", () => {
      const input = "sk-abcdefghijklmnopqrstuvwxyz1234567890abcdefghijkl";
      expect(redactSecrets(input)).toBe("[REDACTED]");
    });
  });

  describe("Anthropic", () => {
    test("redacts API keys", () => {
      const input = "sk-ant-api03-" + "a".repeat(93) + "AA";
      expect(redactSecrets(input)).toBe("[REDACTED]");
    });

    test("redacts admin keys", () => {
      const input = "sk-ant-admin01-" + "a".repeat(93) + "AA";
      expect(redactSecrets(input)).toBe("[REDACTED]");
    });
  });

  describe("Stripe", () => {
    test("redacts live secret keys", () => {
      expect(redactSecrets("sk_live_abcdefghijklmnopqrstuvwxyz")).toBe("[REDACTED]");
    });

    test("redacts test secret keys", () => {
      expect(redactSecrets("sk_test_abcdefghijklmnopqrstuvwxyz")).toBe("[REDACTED]");
    });

    test("redacts restricted keys", () => {
      expect(redactSecrets("rk_live_abcdefghijklmnopqrstuvwxyz")).toBe("[REDACTED]");
    });
  });

  describe("GitHub", () => {
    test("redacts personal access tokens", () => {
      expect(redactSecrets("ghp_1234567890abcdefghijklmnopqrstuvwxyz")).toBe("[REDACTED]");
    });

    test("redacts fine-grained PATs", () => {
      // github_pat_ followed by exactly 82 word characters
      const input =
        "github_pat_11ABCDEFG0123456789012345678901234567890123456789012345678901234567890123456789012";
      const result = redactSecrets(input);
      expect(result).toContain("[REDACTED]");
      // The main sensitive portion should be redacted
      expect(result).not.toContain("ABCDEFG0123456789012345678901234567890");
    });

    test("redacts OAuth tokens", () => {
      expect(redactSecrets("gho_1234567890abcdefghijklmnopqrstuvwxyz")).toBe("[REDACTED]");
    });

    test("redacts app tokens", () => {
      expect(redactSecrets("ghu_1234567890abcdefghijklmnopqrstuvwxyz")).toBe("[REDACTED]");
    });

    test("redacts refresh tokens", () => {
      expect(redactSecrets("ghr_1234567890abcdefghijklmnopqrstuvwxyz")).toBe("[REDACTED]");
    });
  });

  describe("GitLab", () => {
    test("redacts personal access tokens", () => {
      expect(redactSecrets("glpat-abcdefghijklmnopqrst")).toBe("[REDACTED]");
    });

    test("redacts deploy tokens", () => {
      expect(redactSecrets("gldt-abcdefghijklmnopqrst")).toBe("[REDACTED]");
    });

    test("redacts runner auth tokens", () => {
      expect(redactSecrets("glrt-abcdefghijklmnopqrst")).toBe("[REDACTED]");
    });
  });

  describe("Slack", () => {
    test("redacts bot tokens", () => {
      expect(redactSecrets("xoxb-1234567890-1234567890123-abcdefghij")).toBe("[REDACTED]");
    });

    test("redacts webhook URLs", () => {
      const input = "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX";
      expect(redactSecrets(input)).toBe("[REDACTED]");
    });

    test("redacts app tokens", () => {
      expect(redactSecrets("xapp-1-A12345678-1234567890-abcdefghij")).toBe("[REDACTED]");
    });
  });

  describe("AWS", () => {
    test("redacts access key IDs", () => {
      expect(redactSecrets("AKIAIOSFODNN7EXAMPLE")).toBe("[REDACTED]");
    });

    test("redacts ASIA temporary keys", () => {
      // AWS uses base32 encoding (A-Z, 2-7) for the last 16 characters
      // Total length must be 20 (4 char prefix + 16 char base32)
      // Valid base32 chars: A-Z, 2-7 (no 0, 1, 8, 9)
      expect(redactSecrets("ASIAABCDEFGHIJKLMNOP")).toBe("[REDACTED]");
    });
  });

  describe("NPM", () => {
    test("redacts access tokens", () => {
      const input = "npm_" + "a".repeat(36);
      expect(redactSecrets(input)).toBe("[REDACTED]");
    });
  });

  describe("SendGrid", () => {
    test("redacts API keys", () => {
      const input = "SG." + "a".repeat(66);
      expect(redactSecrets(input)).toBe("[REDACTED]");
    });
  });

  describe("HuggingFace", () => {
    test("redacts access tokens", () => {
      const input = "hf_" + "a".repeat(34);
      expect(redactSecrets(input)).toBe("[REDACTED]");
    });

    test("redacts org API tokens", () => {
      const input = "api_org_" + "a".repeat(34);
      expect(redactSecrets(input)).toBe("[REDACTED]");
    });
  });

  describe("DigitalOcean", () => {
    test("redacts personal access tokens", () => {
      const input = "dop_v1_" + "a".repeat(64);
      expect(redactSecrets(input)).toBe("[REDACTED]");
    });

    test("redacts access tokens", () => {
      const input = "doo_v1_" + "a".repeat(64);
      expect(redactSecrets(input)).toBe("[REDACTED]");
    });
  });

  describe("GCP", () => {
    test("redacts API keys", () => {
      expect(redactSecrets("AIzaSyDaGmWKa4JsXZ-HjGw7ISLn_3namBGewQe")).toBe("[REDACTED]");
    });
  });

  describe("JWT", () => {
    test("redacts JWT tokens", () => {
      // JWT with alphanumeric-only parts for clean matching
      const jwt =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoiMTIzNDU2Nzg5MCJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV";
      const result = redactSecrets(jwt);
      expect(result).toContain("[REDACTED]");
      // At least part of the JWT should be redacted
      expect(result.length).toBeLessThan(jwt.length);
    });
  });

  describe("Private Keys", () => {
    test("redacts RSA private keys", () => {
      const input = "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA...";
      expect(redactSecrets(input)).toContain("[REDACTED]");
      expect(redactSecrets(input)).not.toContain("-----BEGIN RSA PRIVATE KEY-----");
    });

    test("redacts generic private keys", () => {
      const input = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASC...";
      expect(redactSecrets(input)).toContain("[REDACTED]");
    });

    test("redacts EC private keys", () => {
      const input = "-----BEGIN EC PRIVATE KEY-----\nMHQCAQEEI...";
      expect(redactSecrets(input)).toContain("[REDACTED]");
    });
  });

  describe("Grafana", () => {
    test("redacts cloud API tokens", () => {
      const input = "glc_" + "a".repeat(50);
      expect(redactSecrets(input)).toBe("[REDACTED]");
    });

    test("redacts service account tokens", () => {
      expect(redactSecrets("glsa_" + "a".repeat(32) + "_12345678")).toBe("[REDACTED]");
    });
  });

  describe("Shopify", () => {
    test("redacts access tokens", () => {
      expect(redactSecrets("shpat_" + "a".repeat(32))).toBe("[REDACTED]");
    });

    test("redacts private app tokens", () => {
      expect(redactSecrets("shppa_" + "a".repeat(32))).toBe("[REDACTED]");
    });
  });

  describe("Twilio", () => {
    test("redacts API keys", () => {
      expect(redactSecrets("SK" + "a".repeat(32))).toBe("[REDACTED]");
    });
  });

  describe("multiple secrets", () => {
    test("redacts all secrets in text", () => {
      const input =
        "Keys: sk_live_abc123def456ghij AKIAIOSFODNN7EXAMPLE ghp_1234567890abcdefghijklmnopqrstuvwxyz";
      const result = redactSecrets(input);
      expect(result).not.toContain("sk_live_");
      expect(result).not.toContain("AKIA");
      expect(result).not.toContain("ghp_");
      expect(result.match(/\[REDACTED\]/g)?.length).toBe(3);
    });
  });

  describe("false positives", () => {
    test("does not redact normal text", () => {
      const input = "Hello world, status: ok, count: 42";
      expect(redactSecrets(input)).toBe(input);
    });

    test("does not redact short strings", () => {
      const input = "key=abc123";
      expect(redactSecrets(input)).toBe(input);
    });

    test("does not redact code snippets", () => {
      const input = "const x = 5; if (x > 3) { return true; }";
      expect(redactSecrets(input)).toBe(input);
    });
  });
});

describe("SECRET_PATTERNS", () => {
  test("has patterns for major providers", () => {
    const ids = SECRET_PATTERNS.map((p) => p.id);
    expect(ids).toContain("openai-api-key");
    expect(ids).toContain("anthropic-api-key");
    expect(ids).toContain("github-pat");
    expect(ids).toContain("stripe-access-token");
    expect(ids).toContain("aws-access-token");
    expect(ids).toContain("slack-bot-token");
  });

  test("all patterns have global flag", () => {
    for (const { pattern } of SECRET_PATTERNS) {
      expect(pattern.flags).toContain("g");
    }
  });
});
