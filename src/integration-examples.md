---
layout: base.njk
title: "Integration Examples and Best Practices"
description: "Practical integration examples and solutions for ScotAccount implementation challenges"
eleventyNavigation:
  key: integration-examples
  order: 7
---

This page provides practical integration examples and best practices for ScotAccount, helping you implement secure, robust, and production-ready solutions.

## Example: Complete Authentication Flow

**Implementing PKCE (Proof Key for Code Exchange):**

- **Why:** Enhances security by preventing interception attacks
- **How:** Always implement PKCE with the SHA256 method as shown below

```javascript
// Complete authentication flow with PKCE and error handling
async function handleAuthentication(req, res) {
  try {
    // Generate secure parameters
    const pkce = generatePKCE();
    const state = generateSecureState();
    const nonce = generateNonce();

    // Store securely for validation
    await storeAuthState(state, { nonce, codeVerifier: pkce.codeVerifier });

    // Build authorisation URL
    const authUrl = buildAuthorisationUrl({
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scope: "openid",
      state,
      nonce,
      codeChallenge: pkce.codeChallenge,
      codeChallengeMethod: "S256",
    });

    res.redirect(authUrl);
  } catch (error) {
    handleAuthError(error, res);
  }
}
```

## Example: Token Validation

**Verifying ID Tokens:**

- **Why:** Ensures tokens are valid and not tampered with
- **How:** Always validate tokens as shown below

```javascript
// Token validation example
async function validateTokens(tokens, expectedState, expectedNonce) {
  // Validate state first
  const storedAuth = await getAuthState(expectedState);
  if (!storedAuth) {
    throw new Error("Invalid state - possible CSRF attack");
  }

  // Validate ID token
  const payload = await validateIdToken(
    tokens.id_token,
    CLIENT_ID,
    expectedNonce,
    ISSUER
  );

  // Extract and validate claims
  const userInfo = extractUserInfo(payload);

  // Clean up stored state
  await deleteAuthState(expectedState);

  return userInfo;
}
```

## Example: Secure Session Management

**Storing Sessions Securely:**

- **Why:** Protects user data and prevents unauthorised access
- **How:** Use encrypted, server-side session storage

```javascript
// Secure session implementation example
class SecureSession {
  constructor(sessionData) {
    this.userId = sessionData.userId;
    this.sessionId = sessionData.sessionId;
    this.createdAt = Date.now();
    this.lastActivity = Date.now();
    this.expiresAt = Date.now() + 8 * 60 * 60 * 1000; // 8 hours
  }

  isValid() {
    return Date.now() < this.expiresAt;
  }

  updateActivity() {
    this.lastActivity = Date.now();
  }

  async store() {
    const encrypted = encrypt(JSON.stringify(this));
    await redis.setex(`session:${this.sessionId}`, 28800, encrypted);
  }

  static async retrieve(sessionId) {
    const encrypted = await redis.get(`session:${sessionId}`);
    if (!encrypted) return null;

    const data = JSON.parse(decrypt(encrypted));
    const session = new SecureSession(data);

    if (!session.isValid()) {
      await session.destroy();
      return null;
    }

    return session;
  }

  async destroy() {
    await redis.del(`session:${this.sessionId}`);
  }
}
```

## Example: Multi-Environment Configuration

**Configuring for Different Environments:**

- **Why:** Ensures correct settings for development, integration, and production
- **How:** Use environment-specific configuration as shown below

```javascript
// Environment-specific configuration example
const config = {
  development: {
    scotAccountBaseUrl:
      "https://authz.integration.scotaccount.service.gov.scot",
    clientId: process.env.DEV_CLIENT_ID,
    redirectUri: "http://localhost:3000/auth/callback",
  },

  integration: {
    scotAccountBaseUrl:
      "https://authz.integration.scotaccount.service.gov.scot",
    clientId: process.env.INT_CLIENT_ID,
    redirectUri: "https://your-service-int.gov.scot/auth/callback",
  },

  production: {
    scotAccountBaseUrl: "https://authz.scotaccount.service.gov.scot",
    clientId: process.env.PROD_CLIENT_ID,
    redirectUri: "https://your-service.gov.scot/auth/callback",
  },
};

const currentConfig = config[process.env.NODE_ENV || "development"];
```

## Example: Error Handling

**Handling Authentication Errors:**

- **Why:** Improves user experience and simplifies debugging
- **How:** Implement detailed error handling for different scenarios

```javascript
// Error handling example
function handleAuthError(error, req, res) {
  const errorCode = req.query.error;
  const errorDescription = req.query.error_description;

  switch (errorCode) {
    case "access_denied":
      // User cancelled authentication
      res.render("auth-cancelled", {
        message: "Authentication was cancelled. Please try again.",
        retryUrl: "/auth/login",
      });
      break;

    case "invalid_request":
      // Malformed request
      console.error("Invalid auth request:", errorDescription);
      res.status(400).render("error", {
        message: "Invalid authentication request. Please contact support.",
        supportEmail: "support@your-service.gov.scot",
      });
      break;

    case "server_error":
      // ScotAccount service error
      console.error("ScotAccount service error:", errorDescription);
      res.status(502).render("error", {
        message:
          "Authentication service temporarily unavailable. Please try again later.",
        retryUrl: "/auth/login",
      });
      break;

    default:
      // Unexpected error
      console.error("Unexpected auth error:", error);
      res.status(500).render("error", {
        message: "An unexpected error occurred. Please try again.",
        retryUrl: "/auth/login",
      });
  }
}
```

## Example: Monitoring and Logging

**Tracking Authentication Events:**

- **Why:** Enables auditing and monitoring of authentication flows
- **How:** Log events and metrics as shown below

```javascript
// Monitoring and logging example
class AuthMonitoring {
  static logAuthEvent(event, userId, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: event,
      userId: userId,
      sessionId: details.sessionId,
      userAgent: details.userAgent,
      ipAddress: details.ipAddress,
      environment: process.env.NODE_ENV,
    };

    console.log(JSON.stringify(logEntry));

    // Send to monitoring service
    this.sendToMonitoring(logEntry);
  }

  static trackMetric(metric, value, tags = {}) {
    // Send metrics to monitoring system
    metrics.increment(`scotaccount.${metric}`, value, tags);
  }

  static async sendToMonitoring(logEntry) {
    try {
      await fetch(process.env.MONITORING_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      console.error("Failed to send monitoring data:", error);
    }
  }
}

// Usage examples
AuthMonitoring.logAuthEvent("auth_started", null, {
  userAgent: req.get("User-Agent"),
});
AuthMonitoring.logAuthEvent("auth_success", userInfo.userId, {
  sessionId: userInfo.sessionId,
});
AuthMonitoring.trackMetric("auth_duration", authDuration);
```

## Example: Integration and Security Testing

**Testing Authentication and Security:**

- **Why:** Ensures your integration is robust and secure
- **How:** Use integration and security tests as shown below

```javascript
// Integration test example
describe("ScotAccount Integration", () => {
  it("should complete full authentication flow", async () => {
    // Start authentication
    const authResponse = await request(app).get("/auth/login").expect(302);

    // Extract state and code challenge
    const redirectUrl = new URL(authResponse.headers.location);
    const state = redirectUrl.searchParams.get("state");

    // Simulate callback with mock authorisation code
    const callbackResponse = await request(app)
      .get("/auth/callback")
      .query({
        code: "mock_auth_code",
        state: state,
      })
      .expect(302);

    // Verify successful authentication
    expect(callbackResponse.headers.location).toBe("/dashboard");
  });
});

// Security test example
describe("Security Tests", () => {
  it("should reject invalid state parameter", async () => {
    await request(app)
      .get("/auth/callback")
      .query({
        code: "valid_code",
        state: "invalid_state",
      })
      .expect(400);
  });

  it("should reject expired tokens", async () => {
    const expiredToken = createExpiredToken();

    const response = await request(app)
      .get("/api/user")
      .set("Authorisation", `Bearer ${expiredToken}`)
      .expect(401);
  });
});
```

## Production Readiness Checklist

- [ ] **HTTPS enforcement** in all environments
- [ ] **Security headers** implementation
- [ ] **Rate limiting** on authentication endpoints
- [ ] **CORS configuration** for allowed origins
- [ ] **CSP headers** for XSS protection
- [ ] **Secure cookie settings** for session management
- [ ] **Environment variable validation** on startup
- [ ] **Health check endpoints** for monitoring
- [ ] **Graceful shutdown** handling
- [ ] **Database connection pooling** configuration

- [ ] **Performance optimisations** (e.g., JWT key caching, connection pooling, request timeouts)

## Next Steps

<div class="callout callout--success">
<strong>Ready to integrate?</strong> Use these examples and best practices to build a secure, robust ScotAccount integration.
</div>

<div class="callout callout--info">
<strong>Need more help?</strong> Follow the <a href="/scotaccount-complete-guide/">Complete Implementation Guide</a> for comprehensive solutions.
</div>

<div class="callout callout--info">
<strong>Questions about security?</strong> Review the <a href="/scotaccount-token-validation-module/">Token Validation Module</a> for detailed security guidance.
</div>
