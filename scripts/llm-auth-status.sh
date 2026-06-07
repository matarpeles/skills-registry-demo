#!/usr/bin/env bash
set -euo pipefail

status_ok() {
  printf "[ok] %s\n" "$1"
}

status_warn() {
  printf "[warn] %s\n" "$1"
}

status_fail() {
  printf "[fail] %s\n" "$1"
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

redact_line() {
  sed -E \
    -e 's/(api[_-]?key|token|secret|access[_-]?token|refresh[_-]?token)([^[:space:]]*)[[:space:]]*[:=][[:space:]]*[^,}[:space:]]+/\1\2=<redacted>/Ig' \
    -e 's/sk-[A-Za-z0-9_-]+/<redacted>/g' \
    -e 's/AIza[A-Za-z0-9_-]+/<redacted>/g'
}

echo "LLM subscription auth readiness"
echo "--------------------------------"

if command_exists codex; then
  codex_status="$(codex login status 2>&1 | redact_line || true)"
  if printf "%s" "$codex_status" | grep -qi "Logged in"; then
    status_ok "Codex: ${codex_status}"
  else
    status_warn "Codex: not confirmed; run 'codex login --device-auth' for ChatGPT account auth."
  fi
else
  status_fail "Codex CLI not found."
fi

if command_exists claude; then
  claude_status="$(claude auth status 2>&1 | redact_line || true)"
  if printf "%s" "$claude_status" | grep -qi '"loggedIn": true' &&
     printf "%s" "$claude_status" | grep -qi '"authMethod": "claude.ai"'; then
    status_ok "Claude Code: logged in through claude.ai subscription/account auth."
  elif printf "%s" "$claude_status" | grep -qi '"loggedIn": true'; then
    status_warn "Claude Code: logged in, but not via claude.ai. Check 'claude auth status'."
  else
    status_warn "Claude Code: not confirmed; run 'claude auth login' for subscription/account auth."
  fi
else
  status_fail "Claude Code CLI not found."
fi

gemini_settings="${HOME}/.gemini/settings.json"
gemini_oauth="${HOME}/.gemini/oauth_creds.json"
if command_exists gemini; then
  if [ -f "$gemini_settings" ] && grep -q '"selectedAuthType"[[:space:]]*:[[:space:]]*"oauth-personal"' "$gemini_settings" &&
     [ -f "$gemini_oauth" ]; then
    status_ok "Gemini CLI: oauth-personal config and OAuth credentials are present."
  else
    status_warn "Gemini CLI: OAuth account auth not confirmed; run 'gemini' and select personal OAuth login."
  fi
else
  status_fail "Gemini CLI not found."
fi

echo
echo "Provider API env vars present (values redacted)"
for var in OPENAI_API_KEY ANTHROPIC_API_KEY GOOGLE_API_KEY GEMINI_API_KEY; do
  if [ -n "${!var:-}" ]; then
    status_ok "${var}=<set>"
  else
    status_warn "${var}=<unset>"
  fi
done

echo
echo "Port CLI auth"
if command_exists port; then
  if port auth status --no-color >/dev/null 2>&1; then
    status_ok "Port CLI: authenticated."
  else
    status_warn "Port CLI: not authenticated; run 'port auth login --org alsSandbox'."
  fi

  if port skills status --no-color >/dev/null 2>&1; then
    port skills status --no-color | sed -n '1,18p'
  else
    status_warn "Port skills status failed."
  fi
else
  status_fail "Port CLI not found."
fi
