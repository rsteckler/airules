## AI Permission Required: Running the App or Server

You must **ask before starting any application, development server, or runtime process**.

### Rule
Before running anything:
1. Explain:
   - what command will run
   - why execution is needed
   - whether it starts a long-running process
   - expected resource or port usage
2. Ask for explicit approval.

Do not run the process unless the user confirms.

### After Approval
- Run only the specified command.
- Report:
  - URLs, ports, or endpoints
  - key logs or errors

### Default Behavior
If execution is only for validation, prefer:
- static analysis
- code inspection
- asking the user to run it instead

Runtime processes affect system state and must be user-approved.
