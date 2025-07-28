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
- `scotaccount.email` - Verified email address
- `scotaccount.address` - Verified postal address
- `scotaccount.identity` - Verified identity information
- `scotaccount.mobile` - Verified mobile phone number

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
    "https://authz.scotaccount.service.gov.scot/.well-known/openid-configuration"
  );
  return await response.json();
}
```

**Key configuration values**:

- `authorization_endpoint` - Where to send authentication requests
- `token_endpoint` - Where to exchange codes for tokens
- `jwks_uri` - Public keys for token validation
- `end_session_endpoint` - Logout endpoint

### PKCE Implementation

Generate PKCE parameters for security:

```javascript
function generatePKCE() {
  // Generate random code verifier
  const codeVerifier = base64URLEncode(crypto.randomBytes(32));

  // Create SHA256 hash
  const hash = crypto.createHash("sha256").update(codeVerifier).digest();
  const codeChallenge = base64URLEncode(hash);

  return {
    codeVerifier,
    codeChallenge,
    codeChallengeMethod: "S256",
  };
}
```

### Authorization Request

Build the authentication URL:

```javascript
function buildAuthUrl(config, pkce, clientId, redirectUri) {
  const state = crypto.randomBytes(16).toString("hex");
  const nonce = crypto.randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid",
    state: state,
    nonce: nonce,
    code_challenge: pkce.codeChallenge,
    code_challenge_method: pkce.codeChallengeMethod,
  });

  // Store state and nonce for validation
  storeSecurely(state, { nonce, codeVerifier: pkce.codeVerifier });

  return `${config.authorization_endpoint}?${params.toString()}`;
}
```

### Callback Handler

Process the authentication response:

```javascript
function handleCallback(req) {
  const { code, state, error } = req.query;

  // Handle errors first
  if (error) {
    throw new Error(`Authentication failed: ${error}`);
  }

  // Validate state parameter
  const storedData = retrieveSecurely(state);
  if (!storedData) {
    throw new Error("Invalid state parameter");
  }

  return {
    code,
    state,
    nonce: storedData.nonce,
    codeVerifier: storedData.codeVerifier,
  };
}
```

### JWT Client Assertion

Create signed JWT for token exchange:

```javascript
function createClientAssertion(clientId, tokenEndpoint, privateKey) {
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    iss: clientId,
    sub: clientId,
    aud: tokenEndpoint,
    exp: now + 60, // 1 minute expiration
    iat: now,
    jti: crypto.randomUUID(),
  };

  return jwt.sign(payload, privateKey, { algorithm: "RS256" });
}
```

### Token Exchange

Exchange authorization code for tokens:

```javascript
async function exchangeCodeForTokens(
  config,
  code,
  redirectUri,
  codeVerifier,
  clientAssertion
) {
  const response = await fetch(config.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      client_assertion_type:
        "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      client_assertion: clientAssertion,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.status}`);
  }

  return await response.json();
}
```

### ID Token Validation

Validate and extract user information:

```javascript
async function validateIdToken(idToken, clientId, config, expectedNonce) {
  // Get public keys
  const jwks = await fetch(config.jwks_uri).then((r) => r.json());

  // Verify JWT signature and claims
  const decoded = jwt.verify(idToken, getPublicKey(jwks), {
    algorithms: ["RS256"],
    audience: clientId,
    issuer: config.issuer,
  });

  // Validate nonce
  if (decoded.nonce !== expectedNonce) {
    throw new Error("Invalid nonce");
  }

  return {
    userId: decoded.sub,
    sessionId: decoded.sid,
    authenticatedAt: decoded.auth_time,
  };
}
```

## Phase 3: Verified Attributes

### Requesting Additional Scopes

To access verified attributes, request additional scopes:

```javascript
// Example: Request email and address verification
const scope = "openid scotaccount.email scotaccount.address";

const authUrl = buildAuthUrl(config, pkce, clientId, redirectUri, scope);
```

### Attribute Data Structure

**Email Attributes** (`scotaccount.email` scope):

```json
{
  "scotaccount.email": {
    "email": "user@example.com",
    "verified": true,
    "verified_at": "2024-01-15T10:30:00Z"
  }
}
```

**Address Attributes** (`scotaccount.address` scope):

```json
{
  "scotaccount.address": {
    "formatted": "123 Main Street\nEdinburgh EH1 1AA\nScotland",
    "street_address": "123 Main Street",
    "locality": "Edinburgh",
    "postal_code": "EH1 1AA",
    "country": "Scotland",
    "verified": true,
    "verified_at": "2024-01-15T09:15:00Z"
  }
}
```

**Identity Attributes** (`scotaccount.identity` scope):

```json
{
  "scotaccount.identity": {
    "given_name": "John",
    "family_name": "Smith",
    "birthdate": "1990-01-15",
    "verified": true,
    "verified_at": "2024-01-15T14:20:00Z",
    "assurance_level": "GPG45_MEDIUM"
  }
}
```

### Processing Verified Attributes

Extract and validate attribute data:

```javascript
function processVerifiedAttributes(idToken) {
  const attributes = {};

  // Process email verification
  if (idToken["scotaccount.email"]) {
    const email = idToken["scotaccount.email"];
    if (email.verified) {
      attributes.verifiedEmail = {
        address: email.email,
        verifiedAt: new Date(email.verified_at),
      };
    }
  }

  // Process address verification
  if (idToken["scotaccount.address"]) {
    const address = idToken["scotaccount.address"];
    if (address.verified) {
      attributes.verifiedAddress = {
        formatted: address.formatted,
        components: {
          street: address.street_address,
          city: address.locality,
          postcode: address.postal_code,
          country: address.country,
        },
        verifiedAt: new Date(address.verified_at),
      };
    }
  }

  return attributes;
}
```

## Phase 4: Production Deployment

### Environment Configuration

Update endpoints for production:

```javascript
const config = {
  integration: {
    discoveryUrl:
      "https://authz.scotaccount.service.gov.scot/.well-known/openid-configuration",
  },
  production: {
    discoveryUrl:
      "https://authz.scotaccount.service.gov.scot/.well-known/openid-configuration",
  },
};
```

### Monitoring and Logging

Implement comprehensive monitoring:

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

## Complete Example Implementation

Here's a complete Node.js/Express example:

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
<strong>Implementation complete?</strong> Review the <a href="/scotaccount-token-validation-module/">Token Validation Module</a> for advanced security patterns.
</div>

<div class="callout callout--info">
<strong>Need architecture details?</strong> See the <a href="/architecture/">Architecture Overview</a> for system components and data flows.
</div>

<div class="callout callout--warning">
<strong>Ready for production?</strong> Contact the ScotAccount team for production onboarding and security review.
</div>
