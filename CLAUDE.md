# CLAUDE.md — Repository Guide

## Purpose

This repository is a **GitHub template** for creating and deploying Genesys Functions (AWS Lambda-backed Data Actions on the Genesys Cloud platform). When using this template, always respect the conventions described below.

## Repository Structure

```
.github/workflows/   # CI/CD pipelines
function/            # TypeScript source code for the Genesys Function
terraform/           # Terraform configuration to deploy the function to Genesys Cloud
```

## Architecture — `function/`

The function code follows **hexagonal architecture** (ports & adapters):

- `src/handler.ts` — the entry point (adapter). Receives the Genesys `Event` and `Context`, delegates to the domain layer, returns a structured HTTP-like response.
- `src/business/` — the domain layer (port). All business logic lives here, isolated from the infrastructure. `BusinessService` is the canonical starting point.

**Rules:**
- Never put business logic in `handler.ts`. The handler only orchestrates: parse input → call service → format output.
- Never import Genesys-specific types or AWS SDK in `src/business/`. The domain must remain infrastructure-agnostic.
- New capabilities go in `src/business/` as dedicated services or adapters.

## Secrets Management

Genesys Functions receive credentials through the Lambda `context.clientContext` object, injected by the Genesys platform at runtime:

```typescript
context.clientContext.gc_client_id
context.clientContext.gc_client_secret
context.clientContext.gc_aws_region
```

**Never hardcode credentials anywhere in the codebase.** The CI pipeline runs Gitleaks with custom rules that will block any commit containing `gc_client_id` or `gc_client_secret` values. Any secret needed at runtime must come through `clientContext`.

For CI/CD secrets (e.g. Genesys provider credentials for Terraform), use **GitHub Actions Secrets** only — never commit `.tfvars` files (already gitignored).

## CI/CD — `.github/workflows/ci.yml`

The pipeline runs on every pull request targeting `main` and enforces this order:

1. **Gitleaks** — secret scanning (blocks if any secret is detected)
2. **Install** — `npm ci` (clean install from lockfile)
3. **Test** — `npm test` (Cucumber BDD scenarios)
4. **Lint** — `npm run lint` (ESLint with TypeScript rules)
5. **Build** — `npm run build` (TypeScript compilation)

All steps must pass before a PR can be merged. Do not skip or disable any step.

## Testing

Tests use **Cucumber.js** (BDD). Every business behaviour must have a corresponding `.feature` file under `specs/features/` and step definitions under `specs/step_definitions/`.

- Test the domain layer (`BusinessService`) directly — do not test the handler.
- Do not mock the Genesys SDK inside unit tests; isolate via interfaces if needed.

## Terraform — `terraform/`

The Terraform configuration uses the `mypurecloud/genesyscloud` provider to deploy:

- `data_integration.tf` — fetches the existing `Function Data Actions` integration by name.
- `resource_action.tf` — creates the `genesyscloud_integration_action` resource, wiring the deployed ZIP to the integration.
- `main.tf` — provider version pinning.

Key parameters to update when creating a new function:
- Action `name` and `category` in `resource_action.tf`
- `contract_input` / `contract_output` schemas
- `function_config.handler` (must match the compiled output path)

`.tfvars` files are gitignored — pass variables via environment variables or GitHub Actions Secrets in the CD pipeline.

## General Best Practices

- Keep Node.js version consistent across `package.json` `engines.node`, `ci.yml` matrix, and `resource_action.tf` `runtime`.
- Run `npm run zipnodev` to produce `function.zip` (production deps only + compiled `dist/`) before Terraform apply.
- All changes go through a PR — direct pushes to `main` are not allowed.
- TypeScript strict mode must remain enabled; do not weaken `tsconfig.json`.
