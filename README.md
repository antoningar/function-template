# Lambda Function Template

A TypeScript template for AWS Lambda functions with business logic separation and Cucumber testing.

## Setup Instructions

### Prerequisites
- Node.js 22 or higher
- npm

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

### Project Structure

```
├── src/
│   └── handler.ts          # Main Lambda handler
├── business/
│   └── example-service.ts  # Business logic and services
├── specs/
│   └── example.feature     # Gherkin test specifications
├── dist/                   # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── README.md
```

### Development

- **Build TypeScript:** `npm run build`
- **Run tests:** `npm run test`
- **Lint code:** `npm run lint`
- **Clean build:** `npm run clean`

### Usage

1. Implement your business logic in the `business/` folder
2. Update the handler in `src/handler.ts` to use your business services
3. Write Gherkin specifications in the `specs/` folder
4. Build and test before deployment

### Dependencies

- **purecloud-platform-client-v2:** PureCloud SDK
- **@cucumber/cucumber:** BDD testing framework
- **TypeScript:** Type-safe JavaScript development

### Next Steps

- [ ] Write comprehensive Gherkin tests in specs/
- [ ] Create your business services in the business/ folder
- [ ] Update handler.ts with your specific business logic