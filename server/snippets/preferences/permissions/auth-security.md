## AI Restriction: Do Not Make Auth / Security-Sensitive Changes

You must **never modify authentication or security-sensitive code** without explicit human approval.

### Absolute Rule
- You are **not permitted** to autonomously change auth or security-related code.
- This includes:
  - authentication flows (login, logout, session management)
  - authorization logic (roles, permissions, access control)
  - password hashing or credential handling
  - token generation, validation, or refresh logic
  - OAuth / SSO configuration
  - API key or secret management
  - encryption or cryptographic operations
  - CORS, CSP, or other security headers
  - rate limiting or abuse prevention
  - input sanitization related to security (XSS, SQL injection, etc.)

### Required Behavior Instead
If a change touches auth or security-sensitive code:
1. **Do not make the change.**
2. Clearly explain:
   - what needs to change and why
   - the security implications of the change
   - any risks or potential vulnerabilities introduced
3. Provide the exact code diff or steps for the human to review and apply.
4. Wait for explicit human approval before proceeding.

### Safety Principle
Auth and security changes are **human-controlled operations**.  
When such changes are required, your role is to **propose and explain, not execute**.
