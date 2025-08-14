---
layout: base.njk
title: "Complete Implementation Guide"
description: "Comprehensive technical guide for implementing ScotAccount authentication and verified attributes"
eleventyNavigation:
  key: complete-guide
  order: 4
---

This comprehensive guide provides detailed technical implementation instructions for integrating with ScotAccount. Follow these steps to build secure authentication with optional verified attributes.

[[toc]]

## Understanding ScotAccount

ScotAccount is Scotland's centralised digital identity provider that lets government services authenticate users securely and, with consent, access verified personal information. Rather than building and operating your own authentication and identity verification stack, you rely on ScotAccount to provide:

- Consistent user authentication with a persistent UUID per user
- Access to verified attributes when required, with clear user consent
- Standards-based security built on OpenID Connect and OAuth 2.0

From a service perspective, this reduces security and compliance overheads, and gives users a single, familiar journey across services.

## Why OpenID Connect and OAuth 2.0

OpenID Connect adds an identity layer to OAuth 2.0. Together they provide a robust, standards-based approach with built-in controls:

- State for CSRF protection
- Nonce for replay protection
- PKCE to protect the authorisation code flow

Your service redirects the user to ScotAccount for authentication and receives cryptographically signed tokens that you validate using ScotAccount's public keys.

## Architecture Overview

At a high level, the user is redirected from your service to ScotAccount to authenticate. Your backend exchanges the returned authorisation code for tokens, validates the ID token, and creates a session. If verified attributes are required, you initiate a new flow requesting additional scopes and call the attributes endpoint with the access token and a client assertion to receive a signed claims token.

For a detailed diagram and component overview, see the Architecture page.

## Implementation Overview

ScotAccount integration follows a four-phase approach:

1. **Setup & Registration** - Generate keys and register your service
2. **Basic Authentication** - Implement OpenID Connect authentication flow
3. **Verified Attributes** - Add identity, address, and email verification
4. **Production Deployment** - Go live with monitoring and security measures

### Expected Timeline

- **Phase 1**: 1-2 days (setup and registration)
- **Phase 2**: 3-5 days (basic authentication implementation)
- **Phase 3**: 2-3 days (verified attributes, if required)
- **Phase 4**: 2-3 days (production deployment and testing)

**Total**: 2-4 weeks from start to production

## Phase 1: Setup & Registration

### Generate Cryptographic Keys

**RSA Key Pair (Recommended)**:

```bash
# Generate private key
openssl genpkey -algorithm RSA -out private_key.pem -keylen 3072

# Extract public key
openssl rsa -in private_key.pem -pubout -out public_key.pem

# Verify key length
openssl rsa -in private_key.pem -text -noout | grep "Private-Key"
```

**EC Key Pair (Alternative)**:

```bash
# Generate EC private key
openssl ecparam -genkey -name prime256v1 -out ec_private_key.pem

# Extract public key
openssl ec -in ec_private_key.pem -pubout -out ec_public_key.pem
```

### Secure Key Storage

Store private keys securely using a secrets manager:

**AWS Secrets Manager**:

```bash
aws secretsmanager create-secret \
  --name "scotaccount/private-key" \
  --secret-string file://private_key.pem
```

**Azure Key Vault**:

```bash
az keyvault secret set \
  --vault-name "your-keyvault" \
  --name "scotaccount-private-key" \
  --file private_key.pem
```

### Service Registration

Submit these details to the ScotAccount team:

**Required Information**:

- **Service name** and description
- **Public key** (from generated key pair)
- **Redirect URIs** (where users return after authentication)
- **Post-logout redirect URIs** (where users go after logout)
- **Required scopes** (see scope reference below)
- **Production IP addresses** (if IP allowlisting required)
- **Technical contact** details

**Scope Reference**:

- `openid` - Required for all integrations
- `scotaccount.gpg45.medium` - Verified identity (GPG45 Medium)
- `scotaccount.address` - Verified postal address
- `scotaccount.email` - Verified email address

### Registration Response

You'll receive:

- **Client ID** - Your unique service identifier
- **Configuration URLs** - Integration and production endpoints
- **Testing credentials** - For development environment access

## Phase 2: Basic Authentication

### Discovery Endpoint Integration

Always retrieve current configuration dynamically:

```javascript
async function getOidcConfiguration() {
  const response = await fetch(
    "https://authz.integration.scotaccount.service.gov.scot/.well-known/openid-configuration"
  );
  return await response.json();
}
```

**Key configuration values**:

- `authorization_endpoint` - Where to send authentication requests
- `token_endpoint` - Where to exchange codes for tokens
- `jwks_uri` - Public keys for token validation

### PKCE Implementation

You must generate a code verifier and corresponding SHA256-based code challenge, and include the challenge in the initial authorisation request. When exchanging the code for tokens, provide the original verifier. This binds the returned authorisation code to your original request and prevents interception.

### Authorisation Request

Build an authorisation URL including: `client_id`, `redirect_uri`, `response_type=code`, `scope`, `state`, `nonce`, `code_challenge`, and `code_challenge_method=S256`. Store the `state`, `nonce`, and PKCE verifier securely until the callback is processed.

### Callback Handling

Validate the returned `state` before doing anything else. If it does not match, reject the response. Extract the authorisation `code`, retrieve the stored `nonce` and PKCE verifier, and proceed to token exchange.

### Client Assertion

Authenticate your client to the token and attributes endpoints using a signed JWT (private_key_jwt). The assertion includes `iss`, `sub`, `aud` (endpoint URL), `exp` (up to 6 months), `iat`, and a unique `jti`.

### Token Exchange

Exchange the authorisation code at the token endpoint with: `grant_type=authorization_code`, the received `code`, your `redirect_uri`, `client_assertion_type`, your `client_assertion`, and the PKCE `code_verifier`.

### ID Token Validation

Validate the ID token signature using ScotAccount's JWKS. Check audience equals your client ID, issuer matches discovery, and the `nonce` matches the original value. Extract `sub` (persistent user UUID) and `sid` (session ID).

## Phase 3: Verified Attributes

### Verified Attributes and Consent

Request additional scopes only when functionality requires them. Users must be present and consent to sharing each type of verified information. To access verified attributes, start a new authorisation flow with the additional scopes:

```http
GET https://authz.integration.scotaccount.service.gov.scot/authorize?
    client_id=your-client-id&
    redirect_uri=https://yourservice.gov.scot/auth/callback&
    response_type=code&
    scope=openid%20scotaccount.email%20scotaccount.address%20scotaccount.gpg45.medium&
    state=your-state&
    nonce=your-nonce&
    code_challenge=your-code-challenge&
    code_challenge_method=S256
```

After exchanging the code for an access token, request attributes at the attributes endpoint using the access token and a new client assertion whose audience is the attributes URL:

```http
GET https://issuer.main.integration.scotaccount.service.gov.scot/attributes/values
Authorization: Bearer [access-token]
DIS-Client-Assertion: [client-assertion-for-attributes-endpoint]
```

The response contains a signed `claimsToken` JWT. Validate it and read `verified_claims`. Each entry includes the scope, the verified claims (for example identity names and date of birth), and detailed verification metadata (outcome, trust framework, assurance policy, confidence level, time, and verifier).

## Phase 4: Production Deployment

### Environments and Configuration

Use integration endpoints during development and testing, then switch to production endpoints when onboarding completes. Always resolve actual endpoints via discovery.

```javascript
const config = {
  integration: {
    discoveryUrl:
      "https://authz.integration.scotaccount.service.gov.scot/.well-known/openid-configuration",
  },
  production: {
    discoveryUrl:
      "https://authz.scotaccount.service.gov.scot/.well-known/openid-configuration",
  },
};
```

### Monitoring and Logging

Implement comprehensive monitoring for authentication success/failure rates, discovery and JWKS availability, and unusual error patterns. Log events with sufficient detail for troubleshooting whilst protecting sensitive data:

```javascript
// Log authentication events
function logAuthEvent(event, userId, details) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      event: event,
      userId: userId,
      sessionId: details.sessionId,
      userAgent: details.userAgent,
      ipAddress: details.ipAddress,
    })
  );
}

// Track authentication metrics
function trackMetrics(event, duration) {
  // Send to your monitoring system
  metrics.increment(`scotaccount.${event}`);
  metrics.timing(`scotaccount.${event}.duration`, duration);
}
```

### Error Handling

Implement user-friendly error handling:

```javascript
function handleAuthError(error, res) {
  console.error("Authentication error:", error);

  switch (error.message) {
    case "access_denied":
      res.redirect("/auth/cancelled");
      break;
    case "invalid_request":
      res.status(400).render("error", {
        message: "Invalid authentication request",
      });
      break;
    default:
      res.status(500).render("error", {
        message: "Authentication service temporarily unavailable",
      });
  }
}
```

### Security Checklist

Before going live, verify:

- [ ] **Private keys** stored securely in secrets manager
- [ ] **HTTPS only** - no HTTP endpoints in production
- [ ] **State validation** implemented for CSRF protection
- [ ] **Nonce validation** prevents replay attacks
- [ ] **Token expiration** handled correctly
- [ ] **Session management** implemented securely
- [ ] **Error logging** without exposing sensitive data
- [ ] **Rate limiting** on authentication endpoints
- [ ] **Monitoring** and alerting configured

## Implementation References

For end-to-end implementation examples and code, see the following developer-focused pages:

- Integration Examples and Best Practices
- Token Validation Module

Below is a minimal Node.js/Express example to illustrate request sequencing. For production-ready code, refer to the pages above.

```javascript
const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const app = express();

// Configuration
const CLIENT_ID = process.env.SCOTACCOUNT_CLIENT_ID;
const PRIVATE_KEY = process.env.SCOTACCOUNT_PRIVATE_KEY;
const REDIRECT_URI = process.env.SCOTACCOUNT_REDIRECT_URI;

// Routes
app.get("/auth/login", async (req, res) => {
  try {
    const config = await getOidcConfiguration();
    const pkce = generatePKCE();
    const authUrl = buildAuthUrl(config, pkce, CLIENT_ID, REDIRECT_URI);

    res.redirect(authUrl);
  } catch (error) {
    handleAuthError(error, res);
  }
});

app.get("/auth/callback", async (req, res) => {
  try {
    const callbackData = handleCallback(req);
    const config = await getOidcConfiguration();

    const clientAssertion = createClientAssertion(
      CLIENT_ID,
      config.token_endpoint,
      PRIVATE_KEY
    );

    const tokens = await exchangeCodeForTokens(
      config,
      callbackData.code,
      REDIRECT_URI,
      callbackData.codeVerifier,
      clientAssertion
    );

    const userInfo = await validateIdToken(
      tokens.id_token,
      CLIENT_ID,
      config,
      callbackData.nonce
    );

    // Store user session
    req.session.user = userInfo;

    res.redirect("/dashboard");
  } catch (error) {
    handleAuthError(error, res);
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

## Troubleshooting Common Issues

### Invalid Client Assertion

**Symptom**: `invalid_client` error during token exchange
**Solution**: Check JWT claims, expiration time, and private key format

### State Parameter Mismatch

**Symptom**: CSRF protection errors
**Solution**: Ensure state is generated, stored, and validated correctly

### Token Validation Failures

**Symptom**: JWT verification errors
**Solution**: Verify audience, issuer, and nonce claims match expected values

### PKCE Errors

**Symptom**: `invalid_grant` errors
**Solution**: Ensure code verifier and challenge are generated and used correctly

## Support and Next Steps

<div class="callout callout--success">
<strong>Implementation complete?</strong> Review the <a href="{{ '/scotaccount-token-validation-module/' | url }}">Token Validation Module</a> for advanced security patterns.
</div>

<div class="callout callout--info">
<strong>Need architecture details?</strong> See the <a href="{{ '/architecture/' | url }}">Architecture Overview</a> for system components and data flows.
</div>

<div class="callout callout--warning">
<strong>Ready for production?</strong> Contact the ScotAccount team for production onboarding and security review.
</div>
