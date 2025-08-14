---
layout: base.njk
title: "Getting Started with ScotAccount"
description: "Quick start guide for developers integrating with ScotAccount - Scotland's digital identity service"
eleventyNavigation:
  key: getting-started
  order: 2
---

Get up and running with ScotAccount in 30 minutes. This guide covers the essential steps to integrate Scotland's digital identity service into your application.

## Prerequisites

Before you begin, ensure you have:

- **Development environment** set up with HTTPS capability
- **RSA 3072-bit or EC P-256 key pair** generated using OpenSSL
- **Basic understanding** of OpenID Connect and OAuth 2.0
- **Access to ScotAccount** integration environment

<div class="callout callout--info">
<strong>Need help with key generation?</strong> See our <a href="{{ '/scotaccount-complete-guide/#key-generation' | url }}">complete key generation guide</a> for step-by-step instructions.
</div>

## Quick Start Checklist

### Phase 1: Setup & Registration

- [ ] **Generate key pair** - Create RSA 3072-bit or EC P-256 keys
- [ ] **Store private key securely** - Use a secrets manager (AWS Secrets Manager, Azure Key Vault)
- [ ] **Determine required scopes** - Basic authentication or verified attributes
- [ ] **Define redirect URIs** - Set up callback URLs for your service
- [ ] **Submit registration** - Provide details to ScotAccount team
- [ ] **Receive client_id** - Get your unique client identifier

### Phase 2: Basic Authentication

- [ ] **Implement discovery endpoint** - Retrieve current configuration automatically
- [ ] **Build PKCE parameters** - Generate code verifier and challenge
- [ ] **Create authorization request** - Build secure authentication URL
- [ ] **Implement callback handler** - Process authentication response
- [ ] **Build JWT client assertion** - Use your private key for token requests
- [ ] **Complete token exchange** - Get access and ID tokens
- [ ] **Validate ID tokens** - Extract and verify user identity

### Phase 3: Verified Attributes (Optional)

- [ ] **Choose additional scopes** - Select identity, address, or email verification
- [ ] **Handle attribute requests** - Manage user consent flow
- [ ] **Process attribute responses** - Parse verified claims data
- [ ] **Validate and store data** - Implement secure data handling

### Phase 4: Production Deployment

- [ ] **Update to production endpoints** - Switch from integration to live URLs
- [ ] **Implement monitoring** - Add logging and error tracking
- [ ] **Add error handling** - Create user-friendly error messages
- [ ] **Complete security review** - Run penetration testing

## Core Authentication Flow

The ScotAccount authentication process follows these key steps:

### 1. Discovery Configuration

First, retrieve the current configuration:

```http
GET https://authz.integration.scotaccount.service.gov.scot/.well-known/openid-configuration
```

This provides all endpoint URLs and supported features.

### 2. Generate Security Parameters

Your application must generate:

- **Code verifier** - Random string for PKCE security
- **Code challenge** - SHA256 hash of the verifier
- **State parameter** - Unique value to prevent CSRF attacks
- **Nonce** - Random value for replay protection

### 3. Redirect to ScotAccount

Build the authorization URL and redirect users:

```
https://authz.integration.scotaccount.service.gov.scot/authorize?
    client_id=your-client-id&
    redirect_uri=https://yourservice.gov.scot/auth/callback&
    response_type=code&
    scope=openid&
    state=your-state-value&
    nonce=your-nonce-value&
    code_challenge=your-code-challenge&
    code_challenge_method=S256
```

### 4. Handle Callback

Users authenticate at ScotAccount and return to your callback URL:

```
https://yourservice.gov.scot/auth/callback?
    code=authorization-code&
    state=your-state-value
```

**Critical**: Always validate the state parameter matches your original value.

### 5. Exchange Code for Tokens

Create a JWT client assertion and exchange the authorization code:

```http
POST https://authz.integration.scotaccount.service.gov.scot/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=authorization-code&
redirect_uri=https://yourservice.gov.scot/auth/callback&
client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&
client_assertion=your-jwt-assertion&
code_verifier=your-code-verifier
```

### 6. Validate and Use Tokens

Extract user information from the ID token:

```json
{
  "sub": "4f6893f4-6fbe-423e-a5cc-d3c93e5a7c41",
  "aud": "your-client-id",
  "iss": "https://authz.integration.scotaccount.service.gov.scot",
  "nonce": "your-nonce-value",
  "sid": "session-id-for-logout"
}
```

The `sub` claim contains the user's persistent UUID identifier.

## Key Security Requirements

### PKCE (Proof Key for Code Exchange)

- **Always required** for all authorization requests
- Protects against authorization code interception attacks
- Must use SHA256 method (`S256`)

### State Parameter Validation

- **Generate unique state** for each authorization request
- **Validate on callback** - reject if missing or incorrect
- **Store securely** during the authentication flow

### JWT Client Assertions

- **Use your private key** to sign assertions
- **Include required claims**: `iss`, `sub`, `aud`, `exp`, `iat`, `jti`
- **Set short expiration** (recommended: 60 seconds)

### ID Token Validation

- **Verify signature** using ScotAccount's public keys
- **Check audience** matches your `client_id`
- **Validate issuer** matches ScotAccount's URL
- **Confirm nonce** matches your original value

## Common Integration Patterns

### Session Management

```javascript
// Store user session after successful authentication
const userSession = {
  uuid: idToken.sub,
  sessionId: idToken.sid,
  authenticatedAt: Date.now(),
  expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
};
```

### Logout Implementation

```javascript
// Redirect to ScotAccount logout
const logoutUrl = `https://authz.integration.scotaccount.service.gov.scot/logout?
  id_token_hint=${idToken}&
  post_logout_redirect_uri=${encodeURIComponent(postLogoutUrl)}`;
```

### Error Handling

```javascript
// Handle common error scenarios
if (error === "access_denied") {
  // User cancelled authentication
  showMessage("Authentication cancelled");
} else if (error === "invalid_request") {
  // Check your parameters
  logError("Invalid request parameters", errorDescription);
}
```

## Next Steps

<div class="callout callout--success">
<strong>Ready for detailed implementation?</strong> Move on to the <a href="{{ '/scotaccount-complete-guide/' | url }}">Complete Integration Guide</a> for comprehensive technical details.
</div>

<div class="callout callout--info">
<strong>Need verified attributes?</strong> Learn about <a href="{{ '/scotaccount-token-validation-module/' | url }}">token validation</a> and attribute handling.
</div>

<div class="callout callout--warning">
<strong>Planning for production?</strong> Review the <a href="{{ '/architecture/' | url }}">architecture overview</a> to understand system components and scalability considerations.
</div>

## Support and Resources

- **Integration support**: Contact the ScotAccount team for technical assistance
- **Testing environment**: Use integration endpoints for development and testing
- **Documentation**: Refer to the complete guide for detailed implementation patterns
- **Security**: Follow all security requirements for production deployment
