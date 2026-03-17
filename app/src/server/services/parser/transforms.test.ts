import { describe, expect, test } from "bun:test";

import { createTransforms } from "./transforms";

describe("createTransforms", () => {
  describe("with workingDir", () => {
    const workingDir = "/Users/john/projects/myapp";
    const t = createTransforms(workingDir);

    describe("toRelativePath", () => {
      test("converts absolute path to project-relative", () => {
        expect(t.toRelativePath("/Users/john/projects/myapp/src/index.ts")).toBe("src/index.ts");
      });

      test("handles root-level files", () => {
        expect(t.toRelativePath("/Users/john/projects/myapp/package.json")).toBe("package.json");
      });

      test("handles deeply nested paths", () => {
        expect(t.toRelativePath("/Users/john/projects/myapp/packages/core/lib/utils.py")).toBe(
          "packages/core/lib/utils.py",
        );
      });

      test("falls back for paths outside workingDir", () => {
        const result = t.toRelativePath("/Users/john/other/file.ts");
        expect(result).not.toContain("/Users/john");
        expect(result).toBe("other/file.ts");
      });

      test("returns path as-is when no home dir prefix and outside workingDir", () => {
        expect(t.toRelativePath("/tmp/file.ts")).toBe("/tmp/file.ts");
      });
    });
  });

  describe("with Windows workingDir", () => {
    const t = createTransforms("C:\\Users\\john\\projects\\myapp");

    test("converts Windows absolute path to project-relative", () => {
      expect(t.toRelativePath("C:\\Users\\john\\projects\\myapp\\src\\index.ts")).toBe(
        "src/index.ts",
      );
    });

    test("converts Windows path with forward slashes", () => {
      expect(t.toRelativePath("C:/Users/john/projects/myapp/src/index.ts")).toBe("src/index.ts");
    });

    test("handles root-level files", () => {
      expect(t.toRelativePath("C:\\Users\\john\\projects\\myapp\\config.json")).toBe("config.json");
    });

    test("handles D: drive letter outside workingDir", () => {
      expect(t.toRelativePath("D:\\other\\file.ts")).toBe("/other/file.ts");
    });
  });

  describe("with Linux workingDir", () => {
    const t = createTransforms("/home/john/projects/myapp");

    test("converts absolute path to project-relative", () => {
      expect(t.toRelativePath("/home/john/projects/myapp/src/index.ts")).toBe("src/index.ts");
    });

    test("falls back for paths outside workingDir", () => {
      expect(t.toRelativePath("/home/john/other/file.ts")).toBe("other/file.ts");
    });
  });

  describe("without workingDir (null)", () => {
    const t = createTransforms(null);

    test("strips macOS home dir prefix", () => {
      expect(t.toRelativePath("/Users/john/projects/myapp/src/file.ts")).toBe(
        "projects/myapp/src/file.ts",
      );
    });

    test("strips Linux home dir prefix", () => {
      expect(t.toRelativePath("/home/john/projects/myapp/src/file.ts")).toBe(
        "projects/myapp/src/file.ts",
      );
    });

    test("strips Windows home dir prefix", () => {
      expect(t.toRelativePath("C:\\Users\\john\\projects\\myapp\\src\\file.ts")).toBe(
        "projects/myapp/src/file.ts",
      );
    });

    test("returns normalized path when no home dir prefix", () => {
      expect(t.toRelativePath("/tmp/file.ts")).toBe("/tmp/file.ts");
    });
  });

  describe("sanitizeResult", () => {
    const t = createTransforms("/Users/john/projects/myapp");

    test("strips Unix paths from bash output", () => {
      const result = t.sanitizeResult(
        "Bash",
        "Error in /Users/john/projects/myapp/src/index.ts:42",
      );
      expect(result).not.toContain("/Users/john");
      expect(result).toContain("src/index.ts:42");
    });

    test("strips Windows paths from bash output", () => {
      const result = t.sanitizeResult(
        "Bash",
        "Error in C:\\Users\\john\\projects\\myapp\\src\\index.ts:42",
      );
      expect(result).not.toContain("Users\\john");
      expect(result).toContain("src/index.ts");
    });

    test("strips mixed paths", () => {
      const result = t.sanitizeResult(
        "Bash",
        "Unix: /Users/john/projects/myapp/src/a.ts Win: C:\\Users\\john\\projects\\myapp\\src\\b.ts",
      );
      expect(result).not.toContain("/Users/john");
      expect(result).not.toContain("\\Users\\john");
    });

    test("strips Linux /home/ paths from bash output", () => {
      const tLinux = createTransforms("/home/john/projects/myapp");
      const result = tLinux.sanitizeResult(
        "Bash",
        "Error in /home/john/projects/myapp/src/index.ts:42",
      );
      expect(result).not.toContain("/home/john");
      expect(result).toContain("src/index.ts:42");
    });

    test("removes system-reminder tags", () => {
      const result = t.sanitizeResult(
        "Bash",
        "output <system-reminder>secret</system-reminder> more",
      );
      expect(result).not.toContain("system-reminder");
      expect(result).not.toContain("secret");
    });
  });

  describe("transformToolUse", () => {
    const t = createTransforms("/Users/john/projects/myapp");

    test("relativizes file_path in Read tool", () => {
      const block = t.transformToolUse("id1", "Read", {
        file_path: "/Users/john/projects/myapp/src/index.ts",
      });
      expect(block).toMatchObject({
        type: "file_read",
        file_path: "src/index.ts",
      });
    });

    test("relativizes file_path in Write tool", () => {
      const block = t.transformToolUse("id2", "Write", {
        file_path: "/Users/john/projects/myapp/src/main.ts",
        content: "hello",
      });
      expect(block).toMatchObject({
        type: "file_write",
        file_path: "src/main.ts",
      });
    });

    test("relativizes file_path in Edit tool", () => {
      const block = t.transformToolUse("id3", "Edit", {
        file_path: "/Users/john/projects/myapp/src/utils.ts",
        old_string: "a",
        new_string: "b",
      });
      expect(block).toMatchObject({
        type: "file_edit",
        file_path: "src/utils.ts",
      });
    });

    test("relativizes Windows file_path in Read tool", () => {
      const tWin = createTransforms("C:\\Users\\john\\projects\\myapp");
      const block = tWin.transformToolUse("id4", "Read", {
        file_path: "C:\\Users\\john\\projects\\myapp\\src\\index.ts",
      });
      expect(block).toMatchObject({
        type: "file_read",
        file_path: "src/index.ts",
      });
    });
  });

  describe("secret redaction", () => {
    const t = createTransforms("/Users/john/projects/myapp");

    test("redacts OpenAI API keys", () => {
      const result = t.sanitizeResult(
        "Bash",
        "OPENAI_API_KEY=sk-proj-abcdefghijklmnopqrstuvwxyz1234567890",
      );
      expect(result).not.toContain("sk-proj-");
      expect(result).toContain("[REDACTED]");
    });

    test("redacts legacy OpenAI API keys", () => {
      const result = t.sanitizeResult(
        "Bash",
        "key: sk-abcdefghijklmnopqrstuvwxyz1234567890abcdefghijkl",
      );
      expect(result).not.toContain("sk-abcdef");
      expect(result).toContain("[REDACTED]");
    });

    test("redacts Anthropic API keys", () => {
      const result = t.sanitizeResult(
        "Bash",
        "ANTHROPIC_API_KEY=sk-ant-api03-" + "a".repeat(93) + "AA",
      );
      expect(result).not.toContain("sk-ant-api03-");
      expect(result).toContain("[REDACTED]");
    });

    test("redacts Stripe live keys", () => {
      const result = t.sanitizeResult("Bash", "sk_live_1234567890abcdefghijklmnop");
      expect(result).not.toContain("sk_live_");
      expect(result).toContain("[REDACTED]");
    });

    test("redacts Stripe test keys", () => {
      const result = t.sanitizeResult("Bash", "rk_test_1234567890abcdefghijklmnop");
      expect(result).not.toContain("rk_test_");
      expect(result).toContain("[REDACTED]");
    });

    test("redacts GitHub personal access tokens", () => {
      const result = t.sanitizeResult(
        "Bash",
        "GITHUB_TOKEN=ghp_1234567890abcdefghijklmnopqrstuvwxyz",
      );
      expect(result).not.toContain("ghp_");
      expect(result).toContain("[REDACTED]");
    });

    test("redacts GitHub fine-grained PAT", () => {
      const result = t.sanitizeResult("Bash", "token: github_pat_" + "a".repeat(82));
      expect(result).not.toContain("github_pat_");
      expect(result).toContain("[REDACTED]");
    });

    test("redacts GitLab tokens", () => {
      const result = t.sanitizeResult("Bash", "GITLAB_TOKEN=glpat-abcdefghijklmnopqrst");
      expect(result).not.toContain("glpat-");
      expect(result).toContain("[REDACTED]");
    });

    test("redacts Slack bot tokens", () => {
      const result = t.sanitizeResult("Bash", "SLACK_TOKEN=xoxb-1234567890-1234567890-abcdefghij");
      expect(result).not.toContain("xoxb-");
      expect(result).toContain("[REDACTED]");
    });

    test("redacts AWS access keys", () => {
      const result = t.sanitizeResult("Bash", "AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE");
      expect(result).not.toContain("AKIAIOSFODNN7EXAMPLE");
      expect(result).toContain("[REDACTED]");
    });

    test("redacts NPM tokens", () => {
      const result = t.sanitizeResult(
        "Bash",
        "//registry.npmjs.org/:_authToken=npm_" + "a".repeat(36),
      );
      expect(result).not.toContain("npm_");
      expect(result).toContain("[REDACTED]");
    });

    test("redacts SendGrid API keys", () => {
      const result = t.sanitizeResult("Bash", "SENDGRID_API_KEY=SG." + "a".repeat(66));
      expect(result).not.toContain("SG.");
      expect(result).toContain("[REDACTED]");
    });

    test("redacts private keys", () => {
      const result = t.sanitizeResult(
        "Read",
        "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA...",
      );
      expect(result).not.toContain("-----BEGIN RSA PRIVATE KEY-----");
      expect(result).toContain("[REDACTED]");
    });

    test("redacts JWT tokens", () => {
      // JWT with alphanumeric-only parts for clean matching
      const jwt =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoiMTIzNDU2Nzg5MCJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV";
      const result = t.sanitizeResult("Bash", `Authorization: Bearer ${jwt}`);
      expect(result).toContain("[REDACTED]");
      // At least part of the JWT should be redacted
      expect(result.length).toBeLessThan(`Authorization: Bearer ${jwt}`.length);
    });

    test("redacts GCP API keys", () => {
      const result = t.sanitizeResult(
        "Bash",
        "GCP_API_KEY=AIzaSyDaGmWKa4JsXZ-HjGw7ISLn_3namBGewQe",
      );
      expect(result).not.toContain("AIzaSy");
      expect(result).toContain("[REDACTED]");
    });

    test("redacts multiple secrets in same text", () => {
      const result = t.sanitizeResult(
        "Bash",
        "OPENAI_API_KEY=sk-proj-abc123def456ghi789 GITHUB_TOKEN=ghp_1234567890abcdefghijklmnopqrstuvwxyz",
      );
      expect(result).not.toContain("sk-proj-");
      expect(result).not.toContain("ghp_");
      expect(result.match(/\[REDACTED\]/g)?.length).toBeGreaterThanOrEqual(2);
    });

    test("preserves non-secret content", () => {
      const result = t.sanitizeResult("Bash", "Hello world, status: ok, count: 42");
      expect(result).toBe("Hello world, status: ok, count: 42");
    });

    test("redacts secrets in file read output", () => {
      const result = t.sanitizeResult("Read", "STRIPE_SECRET_KEY=sk_live_abcdefghijklmnopqrstuv");
      expect(result).not.toContain("sk_live_");
      expect(result).toContain("[REDACTED]");
    });

    test("redacts Slack webhook URLs", () => {
      const result = t.sanitizeResult(
        "Bash",
        "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
      );
      expect(result).not.toContain("hooks.slack.com/services/");
      expect(result).toContain("[REDACTED]");
    });

    test("redacts HuggingFace tokens", () => {
      const result = t.sanitizeResult("Bash", "HF_TOKEN=hf_" + "a".repeat(34));
      expect(result).not.toContain("hf_");
      expect(result).toContain("[REDACTED]");
    });

    test("redacts DigitalOcean tokens", () => {
      const result = t.sanitizeResult("Bash", "DO_TOKEN=dop_v1_" + "a".repeat(64));
      expect(result).not.toContain("dop_v1_");
      expect(result).toContain("[REDACTED]");
    });
  });

  describe("sanitizeText", () => {
    const t = createTransforms(null);

    test("redacts AWS ASIA temporary keys in text", () => {
      const result = t.sanitizeText("My AWS key is ASIAABCDEFGHIJKLMNOP");
      expect(result).toBe("My AWS key is [REDACTED]");
    });

    test("redacts AWS AKIA access keys in text", () => {
      const result = t.sanitizeText("AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE");
      expect(result).toBe("AWS_ACCESS_KEY_ID=[REDACTED]");
    });

    test("redacts multiple secrets in user message", () => {
      const result = t.sanitizeText(
        "Keys: sk_live_abc123def456ghij AKIAIOSFODNN7EXAMPLE ghp_1234567890abcdefghijklmnopqrstuvwxyz",
      );
      expect(result).not.toContain("sk_live_");
      expect(result).not.toContain("AKIA");
      expect(result).not.toContain("ghp_");
      expect(result.match(/\[REDACTED\]/g)?.length).toBe(3);
    });

    test("preserves normal text content", () => {
      const result = t.sanitizeText("Hello, can you help me debug this code?");
      expect(result).toBe("Hello, can you help me debug this code?");
    });

    test("strips absolute paths from text", () => {
      const result = t.sanitizeText("File at /Users/john/projects/app/src/index.ts");
      expect(result).not.toContain("/Users/john");
      expect(result).toContain("projects/app/src/index.ts");
    });

    test("strips system reminders from text", () => {
      const result = t.sanitizeText("Hello <system-reminder>secret stuff</system-reminder> world");
      expect(result).toBe("Hello  world");
    });
  });
});
