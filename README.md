# Genesys Function Template

A GitHub template for building and deploying [Genesys Functions](https://help.mypurecloud.com/articles/about-genesys-functions/) — AWS Lambda-backed actions that integrate with Genesys Cloud Data Actions.

## Overview

This template provides a ready-to-use project structure with:

- A **TypeScript function** following hexagonal architecture
- A **Terraform configuration** to deploy the function to Genesys Cloud
- A **CI/CD pipeline** that enforces quality gates on every pull request

## Repository Structure

```
.github/workflows/   CI pipeline (secret scan, test, lint, build)
function/            TypeScript source code for the Genesys Function
terraform/           Terraform files to deploy the function to Genesys Cloud
```

## Getting Started

### Prerequisites

- Node.js 22
- Terraform
- A Genesys Cloud organisation with a `Function Data Actions` integration enabled

### 1. Use this template

Click **Use this template** on GitHub to create a new repository from this template.

### 2. Develop the function

```bash
cd function
npm ci
```

Edit `src/business/business-service.ts` to implement your business logic. The handler in `src/handler.ts` is the entry point — keep it thin and delegate everything to the business layer.

### 3. Run tests and lint

```bash
npm test       # Cucumber BDD tests
npm run lint   # ESLint
npm run build  # TypeScript compilation
```

### 4. Package the function

```bash
npm run zipnodev
```

This produces `function.zip` containing the compiled `dist/` and production dependencies only.

### 5. Deploy with Terraform

```bash
cd ../terraform
terraform init
terraform apply
```

Provide your Genesys Cloud credentials as environment variables or via a `.tfvars` file (gitignored):

```hcl
# terraform.tfvars  <-- never commit this file
genesyscloud_oauthclient_id     = "..."
genesyscloud_oauthclient_secret = "..."
genesyscloud_region             = "..."
```

## Function Architecture

The function follows **hexagonal architecture**:

```
handler.ts          ← entry point, adapts Genesys event/context to domain calls
business/
  business-service.ts  ← domain logic, no infrastructure dependencies
```

The Genesys platform injects credentials at runtime via `context.clientContext` — no secrets are stored in the code or configuration files.

## CI Pipeline

The pipeline runs on every pull request to `main` and enforces:

| Step | Command |
|------|---------|
| Secret scan | Gitleaks (blocks on any detected secret) |
| Install | `npm ci` |
| Test | `npm test` |
| Lint | `npm run lint` |
| Build | `npm run build` |

All steps must pass before a PR can be merged.

## Customising for Your Function

1. Update the action `name`, `category`, and contract schemas in `terraform/resource_action.tf`.
2. Implement your logic in `src/business/business-service.ts`.
3. Add BDD scenarios in `specs/features/` with matching step definitions in `specs/step_definitions/`.
4. Store any CI/CD secrets (Genesys provider credentials) as **GitHub Actions Secrets** — never commit them.

## License

ISC
