# Port Skills Registry Demo

A curated collection of [Cursor Agent Skills](https://docs.cursor.com/agent/skills) organized for demonstration of Port's skills registry capabilities.

This repository demonstrates how to build and manage a skills registry using Port's service catalog, with 65+ real, production-ready skills organized by category.

## Quick Start

```bash
# Install a skill to your personal skills directory
cp -r skills/workflow/incident-response ~/.cursor/skills/

# Or install to a project
cp -r skills/testing/writing-tests .cursor/skills/
```

## Skills by Category

### 🎯 Port-Specific Skills

Skills that integrate with Port's service catalog and MCP:

| Skill | Description |
|-------|-------------|
| [`triage-incident`](skills/port-specific/triage-incident/SKILL.md) | AI-powered incident triage with severity analysis and communications |
| [`investigate-incident`](skills/port-specific/investigate-incident/SKILL.md) | Root cause analysis using Port's deployment and PR data |
| [`generate-prd`](skills/port-specific/generate-prd/SKILL.md) | Generate PRDs using service catalog context |
| [`service-health-check`](skills/port-specific/service-health-check/SKILL.md) | Comprehensive service health overview from Port |
| [`day-planner`](skills/port-specific/day-planner/SKILL.md) | Plan your day with tasks, PRs, and on-call status |
| [`run-self-service`](skills/port-specific/run-self-service/SKILL.md) | Execute Port self-service actions via natural language |

### 🔧 Cursor-Native Skills (27 skills)

Skills that leverage Cursor's unique agent capabilities:

| Skill | Description |
|-------|-------------|
| [`codebase-onboarding`](skills/cursor-native/codebase-onboarding/SKILL.md) | Parallel exploration to generate onboarding docs |
| [`parallel-code-review`](skills/cursor-native/parallel-code-review/SKILL.md) | 4 subagents review security, performance, correctness, readability |
| [`parallel-ci-triage`](skills/cursor-native/parallel-ci-triage/SKILL.md) | Fix failing CI jobs in parallel |
| [`best-of-n-solving`](skills/cursor-native/best-of-n-solving/SKILL.md) | Try multiple approaches in isolated worktrees |
| [`visual-qa-testing`](skills/cursor-native/visual-qa-testing/SKILL.md) | Screenshot and audit UI changes |
| [`grinding-until-pass`](skills/cursor-native/grinding-until-pass/SKILL.md) | Iterate until tests pass |
| [+ 21 more...](skills/cursor-native/) | |

### 📊 Analytics & Tracking (3 skills)

| Skill | Description |
|-------|-------------|
| [`adding-analytics`](skills/analytics-tracking/adding-analytics/SKILL.md) | Add PostHog event tracking and session replay |
| [`adding-feature-flags`](skills/analytics-tracking/adding-feature-flags/SKILL.md) | Feature flags for gradual rollouts |
| [`adding-error-tracking`](skills/analytics-tracking/adding-error-tracking/SKILL.md) | Sentry crash reporting and monitoring |

### 🧪 Testing (6 skills)

| Skill | Description |
|-------|-------------|
| [`writing-tests`](skills/testing/writing-tests/SKILL.md) | Comprehensive unit and integration tests |
| [`adding-e2e-tests`](skills/testing/adding-e2e-tests/SKILL.md) | Playwright setup with CI integration |
| [`api-smoke-testing`](skills/testing/api-smoke-testing/SKILL.md) | Hit every API endpoint and report errors |
| [`form-testing`](skills/testing/form-testing/SKILL.md) | Test forms with valid/invalid data |
| [`accessibility-auditing`](skills/testing/accessibility-auditing/SKILL.md) | ARIA, tab order, and contrast checks |
| [`python-tdd-with-uv`](skills/testing/python-tdd-with-uv/SKILL.md) | Test-driven Python development |

### 🏗️ Infrastructure (4 skills)

| Skill | Description |
|-------|-------------|
| [`adding-docker`](skills/infrastructure/adding-docker/SKILL.md) | Multi-stage Dockerfile and compose |
| [`setting-up-ci`](skills/infrastructure/setting-up-ci/SKILL.md) | GitHub Actions CI/CD pipeline |
| [`setting-up-terraform`](skills/infrastructure/setting-up-terraform/SKILL.md) | Infrastructure-as-code setup |
| [`kubernetes-deploying`](skills/infrastructure/kubernetes-deploying/SKILL.md) | K8s deployments, services, and ingress |

### 🔍 Code Quality (6 skills)

| Skill | Description |
|-------|-------------|
| [`reviewing-code`](skills/code-quality/reviewing-code/SKILL.md) | Thorough code review for correctness and maintainability |
| [`auditing-security`](skills/code-quality/auditing-security/SKILL.md) | OWASP Top 10 and secrets exposure checks |
| [`auditing-performance`](skills/code-quality/auditing-performance/SKILL.md) | Bundle size, rendering, and Core Web Vitals |
| [`systematic-debugging`](skills/code-quality/systematic-debugging/SKILL.md) | Structured debugging with git bisect |
| [`fixing-broken-links`](skills/code-quality/fixing-broken-links/SKILL.md) | Crawl and fix broken URLs |
| [`verifying-markdown-formatting`](skills/code-quality/verifying-markdown-formatting/SKILL.md) | Markdown style and consistency |

### 🎨 Frontend & UI (5 skills)

| Skill | Description |
|-------|-------------|
| [`using-ui-stack`](skills/frontend-ui/using-ui-stack/SKILL.md) | Design system enforcement (8px grid, tokens) |
| [`converting-css-to-tailwind`](skills/frontend-ui/converting-css-to-tailwind/SKILL.md) | CSS to Tailwind utility classes |
| [`converting-css-modules-to-tailwind`](skills/frontend-ui/converting-css-modules-to-tailwind/SKILL.md) | CSS Modules migration |
| [`react-native-patterns`](skills/frontend-ui/react-native-patterns/SKILL.md) | React Native and Expo patterns |
| [`exporting-to-png`](skills/frontend-ui/exporting-to-png/SKILL.md) | Export code/diagrams to images |

### 🔄 Workflow (5 skills)

| Skill | Description |
|-------|-------------|
| [`incident-response`](skills/workflow/incident-response/SKILL.md) | Handle production incidents end-to-end |
| [`babysitting-pr`](skills/workflow/babysitting-pr/SKILL.md) | Keep PRs merge-ready automatically |
| [`creating-pr`](skills/workflow/creating-pr/SKILL.md) | Clean, review-ready pull requests |
| [`writing-commit-messages`](skills/workflow/writing-commit-messages/SKILL.md) | Conventional commit messages |
| [`updating-npm-package`](skills/workflow/updating-npm-package/SKILL.md) | Safe npm package updates |

### 📐 Planning & Architecture (2 skills)

| Skill | Description |
|-------|-------------|
| [`architecture-decision-records`](skills/planning-architecture/architecture-decision-records/SKILL.md) | Document technical decisions as ADRs |
| [`database-design`](skills/planning-architecture/database-design/SKILL.md) | Schema design with relationships and indexes |

### 📚 Documentation (2 skills)

| Skill | Description |
|-------|-------------|
| [`adding-api-docs`](skills/documentation/adding-api-docs/SKILL.md) | OpenAPI/Swagger documentation |
| [`writing-copy`](skills/documentation/writing-copy/SKILL.md) | Marketing copy and microcopy |

### 🛠️ Utilities (5 skills)

| Skill | Description |
|-------|-------------|
| [`adding-auth`](skills/utilities/adding-auth/SKILL.md) | OAuth with Auth.js (NextAuth) |
| [`adding-stripe`](skills/utilities/adding-stripe/SKILL.md) | Stripe checkout and subscriptions |
| [`generating-images`](skills/utilities/generating-images/SKILL.md) | Generate images with AI |
| [`prompt-engineering`](skills/utilities/prompt-engineering/SKILL.md) | Write effective LLM prompts |
| [`seo-auditing`](skills/utilities/seo-auditing/SKILL.md) | Technical SEO audit |

## Skill Structure

Each skill is a folder containing a `SKILL.md` file:

```
skills/
├── port-specific/
│   ├── triage-incident/
│   │   └── SKILL.md
│   └── ...
├── cursor-native/
│   ├── codebase-onboarding/
│   │   └── SKILL.md
│   └── ...
└── ...
```

### SKILL.md Format

```markdown
---
name: skill-name
description: What this skill does. When to use it.
user-invocable: true
---

# Skill Name

## When to Use
- Trigger scenario 1
- Trigger scenario 2

## Process
1. Step 1
2. Step 2

## Quality Checklist
- [ ] Verification item
```

## Port Integration

This registry is designed to work with Port's service catalog:

1. **Ingest skills as entities** - Each SKILL.md becomes a Port entity
2. **Track ownership** - Skills are owned by teams
3. **Scorecard compliance** - Ensure skills meet quality standards
4. **Self-service installation** - Install skills via Port actions

### Blueprint Example

```yaml
identifier: skill
title: Skill
schema:
  properties:
    name:
      type: string
    description:
      type: string
    category:
      type: string
      enum: [port-specific, cursor-native, testing, infrastructure, ...]
    invocable:
      type: boolean
  required:
    - name
    - description
```

## Contributing

1. Add your skill to the appropriate category folder
2. Follow the SKILL.md format with frontmatter
3. Keep skills under 500 lines
4. Include quality checklist

## Credits

Base skills sourced from [awesome-cursor-skills](https://github.com/spencerpauly/awesome-cursor-skills) by Spencer Pauly.

## License

MIT
