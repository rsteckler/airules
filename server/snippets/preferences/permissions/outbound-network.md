## AI Permission Required: Outbound Network Access

You must **ask before making any outbound network request**.

### Rule
Before performing any external call:
1. Specify:
   - target URL or service
   - type of request (HTTP, API, download, webhook, etc.)
   - data being sent
2. Explain:
   - purpose of the request
   - potential cost, rate limits, or security implications
3. Ask for explicit approval.

Do not perform network activity unless the user confirms.

### After Approval
- Perform only the approved request.
- Share response status and relevant results.

### Default Behavior
If possible, ask the user to perform the request and provide the response.

External network activity may expose data or incur cost and requires explicit authorization.
