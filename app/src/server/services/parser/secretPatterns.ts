// ABOUTME: Secret detection patterns extracted from gitleaks
// Source: https://github.com/gitleaks/gitleaks/blob/master/config/gitleaks.toml
// These patterns detect API keys, tokens, and other secrets that should be redacted.

type SecretPattern = {
  id: string;
  pattern: RegExp;
};

// ABOUTME: Patterns are converted from gitleaks TOML format to JavaScript RegExp.
// Some patterns use (?i) for case-insensitive matching, converted to 'i' flag.
// Lookbehind assertions are supported in modern Node.js (v10+).
export const SECRET_PATTERNS: SecretPattern[] = [
  // 1Password
  {
    id: "1password-secret-key",
    pattern:
      /\bA3-[A-Z0-9]{6}-(?:[A-Z0-9]{11}|[A-Z0-9]{6}-[A-Z0-9]{5})-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}\b/g,
  },
  { id: "1password-service-account-token", pattern: /ops_eyJ[a-zA-Z0-9+/]{250,}={0,3}/g },

  // Adobe
  { id: "adobe-client-secret", pattern: /\b(p8e-[a-zA-Z0-9]{32})/gi },

  // Age encryption
  { id: "age-secret-key", pattern: /AGE-SECRET-KEY-1[QPZRY9X8GF2TVDW0S3JN54KHCE6MUA7L]{58}/g },

  // Airtable
  { id: "airtable-personal-access-token", pattern: /\b(pat[a-zA-Z0-9]{14}\.[a-f0-9]{64})\b/g },

  // Alibaba
  { id: "alibaba-access-key-id", pattern: /\b(LTAI[a-zA-Z0-9]{20})/g },

  // Anthropic
  { id: "anthropic-admin-api-key", pattern: /\b(sk-ant-admin01-[a-zA-Z0-9_-]{93}AA)/g },
  { id: "anthropic-api-key", pattern: /\b(sk-ant-api03-[a-zA-Z0-9_-]{93}AA)/g },

  // Artifactory
  { id: "artifactory-api-key", pattern: /\bAKCp[A-Za-z0-9]{69}\b/g },
  { id: "artifactory-reference-token", pattern: /\bcmVmd[A-Za-z0-9]{59}\b/g },

  // AWS
  { id: "aws-access-token", pattern: /\b((?:A3T[A-Z0-9]|AKIA|ASIA|ABIA|ACCA)[A-Z2-7]{16})\b/g },
  { id: "aws-bedrock-api-key-long", pattern: /\b(ABSK[A-Za-z0-9+/]{109,269}={0,2})/g },

  // Azure
  { id: "azure-ad-client-secret", pattern: /([a-zA-Z0-9_~.]{3}\dQ~[a-zA-Z0-9_~.-]{31,34})/g },

  // Beamer
  { id: "beamer-api-token", pattern: /(b_[a-z0-9=_-]{44})/gi },

  // ClickHouse
  { id: "clickhouse-cloud-api-secret", pattern: /\b(4b1d[A-Za-z0-9]{38})\b/g },

  // Clojars
  { id: "clojars-api-token", pattern: /CLOJARS_[a-z0-9]{60}/gi },

  // Cloudflare
  { id: "cloudflare-origin-ca-key", pattern: /\b(v1\.0-[a-f0-9]{24}-[a-f0-9]{146})/g },

  // Databricks
  { id: "databricks-api-token", pattern: /\b(dapi[a-f0-9]{32}(?:-\d)?)/g },

  // DigitalOcean
  { id: "digitalocean-access-token", pattern: /\b(doo_v1_[a-f0-9]{64})/g },
  { id: "digitalocean-pat", pattern: /\b(dop_v1_[a-f0-9]{64})/g },
  { id: "digitalocean-refresh-token", pattern: /\b(dor_v1_[a-f0-9]{64})/gi },

  // Doppler
  { id: "doppler-api-token", pattern: /dp\.pt\.[a-zA-Z0-9]{43}/gi },

  // Duffel
  { id: "duffel-api-token", pattern: /duffel_(?:test|live)_[a-zA-Z0-9_=-]{43}/gi },

  // Dynatrace
  { id: "dynatrace-api-token", pattern: /dt0c01\.[a-zA-Z0-9]{24}\.[a-zA-Z0-9]{64}/gi },

  // EasyPost
  { id: "easypost-api-token", pattern: /\bEZAK[a-zA-Z0-9]{54}\b/gi },
  { id: "easypost-test-api-token", pattern: /\bEZTK[a-zA-Z0-9]{54}\b/gi },

  // Facebook
  { id: "facebook-page-access-token", pattern: /\b(EAA[MC][a-zA-Z0-9]{100,})/g },

  // Fly.io
  {
    id: "flyio-access-token",
    pattern: /\b(fo1_[\w-]{43}|fm1[ar]_[a-zA-Z0-9+/]{100,}={0,3}|fm2_[a-zA-Z0-9+/]{100,}={0,3})/g,
  },

  // Frame.io
  { id: "frameio-api-token", pattern: /fio-u-[a-zA-Z0-9_=-]{64}/gi },

  // GCP
  { id: "gcp-api-key", pattern: /\b(AIza[\w-]{35})/g },

  // GitHub
  { id: "github-app-token", pattern: /(?:ghu|ghs)_[0-9a-zA-Z]{36}/g },
  { id: "github-fine-grained-pat", pattern: /github_pat_\w{82}/g },
  { id: "github-oauth", pattern: /gho_[0-9a-zA-Z]{36}/g },
  { id: "github-pat", pattern: /ghp_[0-9a-zA-Z]{36}/g },
  { id: "github-refresh-token", pattern: /ghr_[0-9a-zA-Z]{36}/g },

  // GitLab
  { id: "gitlab-cicd-job-token", pattern: /glcbt-[0-9a-zA-Z]{1,5}_[0-9a-zA-Z_-]{20}/g },
  { id: "gitlab-deploy-token", pattern: /gldt-[0-9a-zA-Z_-]{20}/g },
  { id: "gitlab-feature-flag-token", pattern: /glffct-[0-9a-zA-Z_-]{20}/g },
  { id: "gitlab-feed-token", pattern: /glft-[0-9a-zA-Z_-]{20}/g },
  { id: "gitlab-incoming-mail-token", pattern: /glimt-[0-9a-zA-Z_-]{25}/g },
  { id: "gitlab-kubernetes-agent-token", pattern: /glagent-[0-9a-zA-Z_-]{50}/g },
  { id: "gitlab-oauth-app-secret", pattern: /gloas-[0-9a-zA-Z_-]{64}/g },
  { id: "gitlab-pat", pattern: /glpat-[\w-]{20}/g },
  { id: "gitlab-ptt", pattern: /glptt-[0-9a-f]{40}/g },
  { id: "gitlab-rrt", pattern: /GR1348941[\w-]{20}/g },
  { id: "gitlab-runner-auth-token", pattern: /glrt-[0-9a-zA-Z_-]{20}/g },
  { id: "gitlab-scim-token", pattern: /glsoat-[0-9a-zA-Z_-]{20}/g },

  // Grafana
  { id: "grafana-api-key", pattern: /\b(eyJrIjoi[A-Za-z0-9]{70,400}={0,3})/gi },
  { id: "grafana-cloud-api-token", pattern: /\b(glc_[A-Za-z0-9+/]{32,400}={0,3})/gi },
  { id: "grafana-service-account-token", pattern: /\b(glsa_[A-Za-z0-9]{32}_[A-Fa-f0-9]{8})/gi },

  // Harness
  {
    id: "harness-api-key",
    pattern: /(?:pat|sat)\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9]{24}\.[a-zA-Z0-9]{20}/g,
  },

  // HashiCorp
  { id: "hashicorp-tf-api-token", pattern: /[a-z0-9]{14}\.atlasv1\.[a-z0-9_=-]{60,70}/gi },

  // Heroku
  { id: "heroku-api-key-v2", pattern: /\b(HRKU-AA[0-9a-zA-Z_-]{58})/g },

  // HuggingFace
  { id: "huggingface-access-token", pattern: /\b(hf_[a-zA-Z]{34})/g },
  { id: "huggingface-org-api-token", pattern: /\b(api_org_[a-zA-Z]{34})/g },

  // Infracost
  { id: "infracost-api-token", pattern: /\b(ico-[a-zA-Z0-9]{32})/g },

  // Intra42
  { id: "intra42-client-secret", pattern: /\b(s-s4t2(?:ud|af)-[a-f0-9]{64})/gi },

  // Linear
  { id: "linear-api-key", pattern: /lin_api_[a-zA-Z0-9]{40}/gi },

  // Mailgun
  { id: "mailgun-private-api-token", pattern: /(key-[a-f0-9]{32})/gi },
  { id: "mailgun-pub-key", pattern: /(pubkey-[a-f0-9]{32})/gi },

  // MaxMind
  { id: "maxmind-license-key", pattern: /\b([A-Za-z0-9]{6}_[A-Za-z0-9]{29}_mmk)/g },

  // Microsoft Teams
  {
    id: "microsoft-teams-webhook",
    pattern: /https:\/\/[a-z0-9]+\.webhook\.office\.com\/webhookb2\/[a-z0-9-]+/gi,
  },

  // New Relic
  { id: "new-relic-browser-api-token", pattern: /(NRJS-[a-f0-9]{19})/gi },
  { id: "new-relic-insert-key", pattern: /(NRII-[a-z0-9-]{32})/gi },
  { id: "new-relic-user-api-key", pattern: /(NRAK-[a-z0-9]{27})/gi },

  // Notion
  { id: "notion-api-token", pattern: /\b(ntn_[0-9]{11}[A-Za-z0-9]{32}[A-Za-z0-9]{3})/g },

  // NPM
  { id: "npm-access-token", pattern: /\b(npm_[a-z0-9]{36})/gi },

  // Octopus Deploy
  { id: "octopus-deploy-api-key", pattern: /\b(API-[A-Z0-9]{26})/g },

  // Okta
  { id: "okta-access-token", pattern: /(00[\w=-]{40})/g },

  // OpenAI
  { id: "openai-api-key", pattern: /\b(sk-(?:proj|svcacct|admin)-[A-Za-z0-9_-]{20,})/g },
  // Legacy OpenAI keys
  { id: "openai-api-key-legacy", pattern: /\b(sk-[A-Za-z0-9]{48})/g },

  // OpenShift
  { id: "openshift-user-token", pattern: /\b(sha256~[\w-]{43})/g },

  // Perplexity
  { id: "perplexity-api-key", pattern: /\b(pplx-[a-zA-Z0-9]{48})/g },

  // PlanetScale
  { id: "planetscale-api-token", pattern: /\b(pscale_tkn_[\w=.-]{32,64})/gi },
  { id: "planetscale-oauth-token", pattern: /\b(pscale_oauth_[\w=.-]{32,64})/g },
  { id: "planetscale-password", pattern: /\b(pscale_pw_[\w=.-]{32,64})/gi },

  // Postman
  { id: "postman-api-token", pattern: /\b(PMAK-[a-f0-9]{24}-[a-f0-9]{34})/gi },

  // Prefect
  { id: "prefect-api-token", pattern: /\b(pnu_[a-zA-Z0-9]{36})/g },

  // Private Keys
  { id: "private-key", pattern: /-----BEGIN[ A-Z0-9_-]{0,100}PRIVATE KEY(?: BLOCK)?-----/gi },

  // Pulumi
  { id: "pulumi-api-token", pattern: /\b(pul-[a-f0-9]{40})/g },

  // PyPI
  { id: "pypi-upload-token", pattern: /pypi-AgEIcHlwaS5vcmc[\w-]{50,1000}/g },

  // Readme
  { id: "readme-api-token", pattern: /\b(rdme_[a-z0-9]{70})/g },

  // RubyGems
  { id: "rubygems-api-token", pattern: /\b(rubygems_[a-f0-9]{48})/g },

  // Scalingo
  { id: "scalingo-api-token", pattern: /\b(tk-us-[\w-]{48})/g },

  // SendGrid
  { id: "sendgrid-api-token", pattern: /\b(SG\.[a-zA-Z0-9_=-]{66})/gi },

  // Sendinblue
  { id: "sendinblue-api-token", pattern: /\b(xkeysib-[a-f0-9]{64}-[a-zA-Z0-9]{16})/gi },

  // Sentry
  { id: "sentry-org-token", pattern: /\bsntrys_eyJpYXQiO[a-zA-Z0-9+/]{10,200}/g },
  { id: "sentry-user-token", pattern: /\b(sntryu_[a-f0-9]{64})/g },

  // SettleMint
  { id: "settlemint-app-access-token", pattern: /\b(sm_aat_[a-zA-Z0-9]{16})/g },
  { id: "settlemint-personal-access-token", pattern: /\b(sm_pat_[a-zA-Z0-9]{16})/g },
  { id: "settlemint-service-access-token", pattern: /\b(sm_sat_[a-zA-Z0-9]{16})/g },

  // Shippo
  { id: "shippo-api-token", pattern: /\b(shippo_(?:live|test)_[a-fA-F0-9]{40})/g },

  // Shopify
  { id: "shopify-access-token", pattern: /shpat_[a-fA-F0-9]{32}/g },
  { id: "shopify-custom-access-token", pattern: /shpca_[a-fA-F0-9]{32}/g },
  { id: "shopify-private-app-access-token", pattern: /shppa_[a-fA-F0-9]{32}/g },
  { id: "shopify-shared-secret", pattern: /shpss_[a-fA-F0-9]{32}/g },

  // Sidekiq
  {
    id: "sidekiq-sensitive-url",
    pattern:
      /https?:\/\/([a-f0-9]{8}:[a-f0-9]{8})@(?:gems\.contribsys\.com|enterprise\.contribsys\.com)/gi,
  },

  // Slack
  { id: "slack-app-token", pattern: /xapp-\d-[A-Z0-9]+-\d+-[a-z0-9]+/gi },
  { id: "slack-bot-token", pattern: /xoxb-[0-9]{10,13}-[0-9]{10,13}[a-zA-Z0-9-]*/g },
  { id: "slack-config-access-token", pattern: /xoxe\.xox[bp]-\d-[A-Z0-9]{163,166}/gi },
  { id: "slack-config-refresh-token", pattern: /xoxe-\d-[A-Z0-9]{146}/gi },
  { id: "slack-legacy-bot-token", pattern: /xoxb-[0-9]{8,14}-[a-zA-Z0-9]{18,26}/g },
  { id: "slack-legacy-token", pattern: /xox[os]-\d+-\d+-\d+-[a-fA-F\d]+/g },
  { id: "slack-legacy-workspace-token", pattern: /xox[ar]-(?:\d-)?[0-9a-zA-Z]{8,48}/g },
  { id: "slack-user-token", pattern: /xox[pe](?:-[0-9]{10,13}){3}-[a-zA-Z0-9-]{28,34}/g },
  {
    id: "slack-webhook-url",
    pattern:
      /(?:https?:\/\/)?hooks\.slack\.com\/(?:services|workflows|triggers)\/[A-Za-z0-9+/]{43,56}/g,
  },

  // Snyk
  {
    id: "snyk-api-token",
    pattern: /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/gi,
  },

  // Sonar
  { id: "sonar-api-token", pattern: /((?:squ_|sqp_|sqa_)?[a-z0-9=_-]{40})/gi },

  // Sourcegraph
  {
    id: "sourcegraph-access-token",
    pattern: /\b(sgp_(?:[a-fA-F0-9]{16}|local)_[a-fA-F0-9]{40}|sgp_[a-fA-F0-9]{40})/g,
  },

  // Square
  { id: "square-access-token", pattern: /\b((?:EAAA|sq0atp-)[\w-]{22,60})/g },

  // Stripe
  { id: "stripe-access-token", pattern: /\b((?:sk|rk)_(?:test|live|prod)_[a-zA-Z0-9]{10,99})/g },

  // SumoLogic
  { id: "sumologic-access-id", pattern: /(su[a-zA-Z0-9]{12})/g },

  // Telegram
  { id: "telegram-bot-api-token", pattern: /([0-9]{5,16}:A[a-zA-Z0-9_-]{34})/g },

  // Twilio
  { id: "twilio-api-key", pattern: /SK[0-9a-fA-F]{32}/g },

  // Typeform
  { id: "typeform-api-token", pattern: /(tfp_[a-z0-9_=.-]{59})/gi },

  // Vault
  { id: "vault-batch-token", pattern: /\b(hvb\.[\w-]{138,300})/g },
  { id: "vault-service-token", pattern: /\b(hvs\.[\w-]{90,120}|s\.[a-zA-Z0-9]{24})/g },

  // Yandex
  { id: "yandex-api-key", pattern: /(AQVN[A-Za-z0-9_-]{35,38})/g },
  { id: "yandex-aws-access-token", pattern: /(YC[a-zA-Z0-9_-]{38})/g },

  // JWT (generic)
  {
    id: "jwt",
    pattern: /\b(ey[a-zA-Z0-9]{17,}\.ey[a-zA-Z0-9/_-]{17,}\.[a-zA-Z0-9/_-]{10,}={0,2})/g,
  },

  // Generic patterns for common credential formats
  {
    id: "generic-api-key",
    pattern:
      /(?:api[_-]?key|apikey|api[_-]?secret|secret[_-]?key)\s*[:=]\s*['"]?([a-zA-Z0-9_-]{20,})['"]?/gi,
  },
  { id: "generic-password", pattern: /(?:password|passwd|pwd)\s*[:=]\s*['"]?([^\s'"]{8,})['"]?/gi },
  {
    id: "generic-token",
    pattern:
      /(?:auth[_-]?token|access[_-]?token|bearer)\s*[:=]\s*['"]?([a-zA-Z0-9_.-]{20,})['"]?/gi,
  },
];

const REDACTED_PLACEHOLDER = "[REDACTED]";

// ABOUTME: Redacts API keys, tokens, and other secrets from text to prevent
// accidental exposure when sharing sessions publicly. Uses patterns from gitleaks.
export const redactSecrets = (text: string): string => {
  let result = text;
  for (const { pattern } of SECRET_PATTERNS) {
    // Reset lastIndex for global regexes to ensure fresh matching
    pattern.lastIndex = 0;
    result = result.replace(pattern, REDACTED_PLACEHOLDER);
  }
  return result;
};
