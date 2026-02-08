## AWS (deployment target rules)

### Mental Model
- Prefer managed AWS services over self-managed infrastructure when possible.
- Optimize for repeatability, least privilege, and simple rollbacks.

### Infrastructure as Code
- Use the project’s existing IaC toolchain (Terraform / CDK / CloudFormation / Pulumi).
- Keep infra changes incremental and reviewable.
- Avoid “click-ops” in consoles for anything that must be reproducible.

### Accounts, Environments, and Isolation
- Separate environments (dev/stage/prod) with clear isolation (accounts or strong resource boundaries).
- Avoid sharing stateful resources between environments unless explicitly intended.
- Use consistent naming/tagging for ownership, environment, and cost attribution.

### Identity & Access (IAM)
- Default to least privilege.
- Prefer role-based access (IAM roles) over long-lived IAM users/keys.
- Scope policies to specific actions and resources; avoid wildcard policies unless unavoidable.
- Rotate credentials where they exist; prefer short-lived credentials (STS).

### Secrets & Configuration
- Store secrets in AWS-native systems (Secrets Manager or Parameter Store) per project convention.
- Never bake secrets into images, bundles, or repos.
- Keep config environment-specific; avoid branching logic in code to compensate for config drift.

### Networking
- Treat VPC design as foundational:
  - private subnets for compute/data when appropriate
  - strict security group rules
- Prefer private connectivity between services where possible.
- Avoid exposing internal services to the public internet without clear necessity.

### Compute Choices
- Choose the simplest compute option that matches the workload:
  - Lambda for event/HTTP functions
  - ECS/Fargate for containers without server management
  - EKS only when Kubernetes is truly required
  - EC2 only when you need full host control
- Keep compute stateless; move state to managed storage/services.

### Deployment Strategy
- Prefer safe rollout patterns:
  - blue/green or canary for critical services
  - gradual traffic shifting where supported
- Make rollbacks easy: deploy artifacts should be immutable and versioned.

### Data & Durability
- Use managed databases where possible (RDS/Aurora, DynamoDB).
- Enable backups and point-in-time recovery where supported.
- Treat migrations as production events; avoid locking or long-running schema changes.

### Observability
- Centralize logs/metrics/traces using the project’s standard stack (CloudWatch + optional external tools).
- Use structured logs with request IDs and correlation IDs.
- Avoid logging secrets or sensitive data.

### Cost Discipline
- Use tags everywhere (owner, env, service, cost-center).
- Avoid over-provisioning by default; right-size after measuring.
- Prefer autoscaling and pay-per-use services when appropriate.

### Reliability & Limits
- Design for AZ failures where required (multi-AZ, health checks).
- Know service limits and request increases early for production.
- Prefer idempotent operations for retries and event-driven systems.

### Security Posture
- Prefer encryption at rest and in transit by default.
- Restrict public S3 buckets; avoid permissive bucket policies.
- Use WAF/Shield where applicable for public endpoints.

### Consistency
- Follow existing repo conventions for AWS layout, modules/stacks, CI/CD workflows, and environment separation.
- Do not introduce a new deployment platform pattern (e.g., “let’s move to EKS”) unless explicitly requested.
