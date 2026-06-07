# Local LLM Subscription Auth

This checkout is set up to prefer existing account/subscription auth for local AI tools, and to keep provider API keys out of the repository and out of Port skill content.

## Readiness Check

Run:

```bash
./scripts/llm-auth-status.sh
```

The checker only reports auth mode and whether expected environment variable names are present. It does not print token or API key values.

## Local Auth Sources

| Tool | Preferred local auth | Check |
| --- | --- | --- |
| Codex | ChatGPT account auth | `codex login status` |
| Claude Code | Claude subscription/account auth | `claude auth status` should show `authMethod: claude.ai` |
| Gemini CLI | Google OAuth personal auth | `~/.gemini/settings.json` should use `oauth-personal` |
| Port CLI | Port SSO/OAuth | `port auth status` |

## Fallback Provider API Keys

Some skills or scripts may call provider SDKs directly instead of delegating to a logged-in CLI. For those cases, use environment variables supplied by the shell or a local secret manager:

```bash
OPENAI_API_KEY
ANTHROPIC_API_KEY
GOOGLE_API_KEY
GEMINI_API_KEY
```

Do not commit `.env`, `.env.local`, tokens, OAuth credential files, or copied provider keys into this repo. The existing `.gitignore` already excludes `.env` and `.env.local`.

## Port Skills Boundary

`port skills sync` installs skill files from Port. It should not become a secret distribution mechanism. Put provider names, intended auth mode, and setup instructions in skills; keep actual credentials in the local CLI login, OS keychain, or environment.
