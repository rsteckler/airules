## GCP (deployment target rules)

### Mental Model
- Prefer managed GCP services over self-managed infrastructure.
- Optimize for repeatability, least privilege, and straightforward rollbacks.

### Infrastructure as Code
- Use the project’s existing IaC toolchain (Terraform / Deployment Manager / Pulumi, etc.).
- Keep infra changes incremental and reviewable.
- Avoid console-only changes for anything that must be reproducible.

### Projects, Environments, and Isolation
- Separate environments (dev/stage/prod) via distinct GCP projects or strong resource boundaries.
- Avoid sharing stateful resources between environments unless explicitly intended.
- Use consistent labeling for ownership, environment, and cost attribution.

### Identity & Access (IAM)
- Default to least privilege.
- Prefer service accounts with narrowly scoped roles.
- Avoid owner/editor roles for automation; use custom roles if needed.
- Prefer short-lived credentials and workload identity patterns where applicable.

### Secrets & Configuration
- Store secrets in Secret Manager.
- Never bake secrets into images, bundles, or repos.
- Keep config environment-specific; avoid code branching to compensate for config drift.

### Networking
- Treat VPC design as foundational:
  - private networking for internal services where appropriate
  - firewall rules as least-privilege
- Prefer private service connectivity when possible.
- Avoid exposing internal services publicly without clear need.

### Compute Choices
- Choose the simplest compute option that matches the workload:
  - Cloud Run for containerized HTTP services
  - Cloud Functions for event-driven functions
  - GKE only when Kubernetes is truly required
  - Compute Engine only when host-level control is needed
- Keep compute stateless; move state to managed services.

### Deployment Strategy
- Prefer safe rollout patterns:
  - traffic splitting / gradual rollouts (Cloud Run)
  - versioned deployments with easy rollback
- Treat deploy artifacts as immutable and versioned.

### Data & Durability
- Use managed databases where possible (Cloud SQL, Firestore, Spanner).
- Enable backups and PITR where supported.
- Treat migrations as production events; avoid long locks and unsafe schema operations.

### Observability
- Use Cloud Logging/Monitoring (and tracing) per project conventions.
- Prefer structured logs with request/correlation IDs.
- Avoid logging secrets or sensitive data.

### Storage & Access
- Lock down Cloud Storage buckets; avoid public access unless explicitly required.
- Use signed URLs or authenticated access patterns for protected objects.
- Enable lifecycle rules for retention and cost control.

### Cost Discipline
- Label resources consistently (owner, env, service, cost-center).
- Right-size after measuring; avoid over-provisioning by default.
- Prefer autoscaling and pay-per-use services for variable workloads.

### Reliability & Limits
- Design for zonal/region failures where required.
- Know quotas early; request increases before production.
- Prefer idempotent operations to handle retries in event-driven systems.

### Security Posture
- Encrypt in transit and at rest by default.
- Restrict public ingress; use Cloud Armor where applicable.
- Follow least-privilege firewall and IAM rules for services.

### Consistency
- Follow existing repo conventions for GCP layout, modules, CI/CD workflows, and environment separation.
- Do not introduce new platform shifts (e.g., “move everything to GKE”) unless explicitly requested.
