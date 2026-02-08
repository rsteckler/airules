## Azure (deployment target rules)

### Mental Model
- Prefer managed Azure services over self-managed infrastructure.
- Optimize for repeatable deployments, least privilege, and easy rollback.

### Infrastructure as Code
- Use the project’s existing IaC approach (Bicep / ARM / Terraform / Pulumi).
- Keep changes incremental and version-controlled.
- Avoid portal-only (“click-ops”) changes for anything that must be reproducible.

### Subscriptions, Resource Groups, Environments
- Separate environments (dev/stage/prod) using separate resource groups or subscriptions per project convention.
- Avoid sharing stateful resources across environments unless explicitly intended.
- Use consistent naming and tagging (env, owner, service, cost center).

### Identity & Access (Azure AD / RBAC)
- Default to least privilege.
- Prefer managed identities for services instead of client secrets.
- Avoid broad roles (Owner/Contributor) for automation when narrower roles suffice.
- Use role assignments scoped to the smallest necessary resource level.

### Secrets & Configuration
- Store secrets in Azure Key Vault.
- Never commit secrets to the repository or bake them into images/artifacts.
- Keep environment configuration externalized (App Settings, Key Vault references).

### Networking
- Use Virtual Networks and private endpoints for internal services when appropriate.
- Restrict inbound access via NSGs and service-level access controls.
- Avoid exposing internal services publicly without explicit need.

### Compute Choices
- Choose the simplest service for the workload:
  - App Service for web apps/APIs
  - Azure Functions for event-driven workloads
  - Container Apps or AKS only when container orchestration is required
  - Virtual Machines only when full host control is necessary
- Keep compute stateless; move state to managed data services.

### Deployment Strategy
- Use slot-based or versioned deployments when supported (e.g., App Service slots).
- Prefer blue/green or gradual rollout patterns for critical services.
- Ensure deployments are repeatable and artifacts are immutable.

### Data & Durability
- Prefer managed databases (Azure SQL, Cosmos DB, etc.).
- Enable backups and point-in-time recovery where available.
- Treat schema migrations as production events; avoid long-running or blocking changes.

### Observability
- Use Azure Monitor / Application Insights per project conventions.
- Prefer structured logging with correlation/request IDs.
- Avoid logging secrets or sensitive data.

### Storage & Access
- Lock down Storage Accounts; avoid public access unless explicitly required.
- Prefer SAS tokens or identity-based access for controlled access.
- Use lifecycle/retention policies where appropriate.

### Cost Discipline
- Tag all resources consistently.
- Avoid over-provisioning; use autoscaling where supported.
- Prefer consumption-based services for variable workloads.

### Reliability & Limits
- Design for zone/region resilience when required.
- Be aware of service quotas and limits before production rollout.
- Prefer idempotent operations for retry-safe workflows.

### Security Posture
- Enable encryption at rest and enforce HTTPS.
- Use WAF / Front Door / Application Gateway where appropriate for public endpoints.
- Restrict network and identity access by default.

### Consistency
- Follow existing repo conventions for Azure resource layout, IaC structure, and CI/CD integration.
- Do not introduce major platform shifts (e.g., moving to AKS) unless explicitly requested.
