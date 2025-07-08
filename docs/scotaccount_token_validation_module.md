# Token Validation

Validate ID tokens and access tokens received from ScotAccount to ensure they're authentic and intended for your service.

## Overview

ScotAccount issues JSON Web Tokens (JWTs) that must be validated before trusting their contents. This ensures tokens haven't been tampered with and were genuinely issued by ScotAccount.

**Critical Security Note**: Never trust token contents without validation. Always verify signatures and claims.

---

## ID Token Validation

ID tokens contain user identity information and must be validated immediately after receiving them.

### Example ID Token Structure

**Encoded Token** (what you receive):
```
eyJraWQiOiJXZ2lHIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI0ZjY4OTNmNC02ZmJlLTQyM2UtYTVjYy1kM2M5M2U1YTdjNDEiLCJhdWQiOiI1eWh5Z2tzY3R3cHFnIiwiaXNzIjoiaHR0cHM6Ly9hdXRoei5pbnRlZ3JhdGlvbi5zY290YWNjb3VudC5zZXJ2aWNlLmdvdi5zY290IiwiZXhwIjoxNjc4OTMyNjYyLCJpYXQiOjE2Nzg5MzE3NjIsIm5vbmNlIjoiQmRITERXUFJtWThXQllONkJFdEZmSTJSVm9KbXlDUnBwR0ZJdDJoR3k3QSIsImp0aSI6ImZQX1hfMnc2NWlVIiwic2lkIjoieXhaMlZwT255ZFYwQ1Q4ajFTYmxmenRSWURya3EtU0ozT0g3ZWpGN0dRZyJ9.db79iKccqKkXF4MF2IThOV05AZHrlvmNZWAW5ojUzyQoKzHSlPtCEeC3sqwsah84gHMqU0A9ACWPbE8SECdpzOvL6QVCfoWjwuiMEzMsOZvCHccMEpeNX8rbB7_L5Mo5lLOpVl80jIezKNQJ8NMQoOgMGaBm5qkgLTVFuYqVnvpzAEb44xDeSYe7__jaXOUBiGIWMqopeqJRmR1cy5yJ9ShqDa_xoBVmAxXXXv0ZOanE7E7-LCBApdvFNRA-JUUrjMIYUNn8cSkupye6bjLElLT_qPKJc6N0mSOhH43oU5GB-heMhNX18p-07J5pFFAHotcP6VsA2mE7y96gLQ1XrA
```

**Decoded Payload** (after validation):
```json
{
  "sub": "4f6893f4-6fbe-423e-a5cc-d3c93e5a7c41",  // Persistent user identifier
  "aud": "5yhygksctwpqg",                          // Your client ID
  "iss": "https://authz.integration.scotaccount.service.gov.scot",
  "exp": 1678932662,                              // Expiry (15 minutes)
  "iat": 1678931762,                              // Issued at
  "nonce": "BdHLDWPRmY8WBYN6BEtFfI2RVoJmyCRppGFIt2hGy7A",  // Replay protection
  "jti": "fP_X_2w65iU",                          // Unique token ID
  "sid": "yxZ2VpOnydV0CT8j1SblfztRYDrkq-SJ3OH7ejF7GQg"     // Session ID for logout
}
```

### Step-by-Step Validation Process

#### 1. Retrieve ScotAccount's Public Keys

```javascript
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: 'https://authz.integration.scotaccount.service.gov.scot/jwks.json',
  cache: true,
  cacheMaxAge: 600000,  // 10 minutes
  rateLimit: true
});
```

#### 2. Validate Token Signature

```javascript
const jwt = require('jsonwebtoken');

async function validateIdToken(idToken, clientId, nonce, issuer) {
  // 1. Decode to get key ID
  const decodedToken = jwt.decode(idToken, { complete: true });
  if (!decodedToken) {
    throw new Error('Invalid token format');
  }

  // 2. Get public key from ScotAccount
  const key = await client.getSigningKey(decodedToken.header.kid);
  const publicKey = key.getPublicKey();

  // 3. Verify signature and standard claims
  const payload = jwt.verify(idToken, publicKey, {
    issuer: issuer,
    audience: clientId,
    clockTolerance: 5  // Allow 5 seconds for clock skew
  });

  // 4. Validate nonce to prevent replay attacks
  if (payload.nonce !== nonce) {
    throw new Error('Invalid nonce - possible replay attack');
  }

  return payload;
}
```

#### 3. Extract User Information

```javascript
// After successful validation
const userInfo = {
  userId: payload.sub,           // Persistent identifier across all sessions
  sessionId: payload.sid,        // For logout functionality
  authenticatedAt: new Date(payload.iat * 1000),
  expiresAt: new Date(payload.exp * 1000)
};

// Store in your session
req.session.user = userInfo;
```

---

## Access Token Validation

Access tokens are used for requesting verified attributes from ScotAccount.

### Access Token Structure

**Decoded Access Token Example**:
```json
{
  "sub": "4f6893f4-6fbe-423e-a5cc-d3c93e5a7c41",
  "scp": ["openid", "scotaccount.email", "scotaccount.gpg45.medium"],
  "iss": "https://authz.integration.scotaccount.service.gov.scot",
  "exp": 1676775910,
  "iat": 1676775010,
  "jti": "roTzJ33TFe8",
  "cid": "2fs46jov3cm4a"  // Your client ID
}
```

### Access Token Validation

```javascript
async function validateAccessToken(accessToken, clientId, issuer) {
  const decodedToken = jwt.decode(accessToken, { complete: true });
  if (!decodedToken) {
    throw new Error('Invalid access token format');
  }

  const key = await client.getSigningKey(decodedToken.header.kid);
  const publicKey = key.getPublicKey();

  const payload = jwt.verify(accessToken, publicKey, {
    issuer: issuer,
    clockTolerance: 5
  });

  // Verify client ID matches
  if (payload.cid !== clientId) {
    throw new Error('Access token not issued for this client');
  }

  return payload;
}
```

---

## Common Validation Errors

### Signature Verification Failures

**Error**: `JsonWebTokenError: invalid signature`
**Cause**: Token has been tampered with or wrong public key used
**Solution**: Ensure you're using the correct JWKS endpoint and key ID

```javascript
// Always use the latest JWKS
const jwksUri = 'https://authz.integration.scotaccount.service.gov.scot/jwks.json';
```

### Expired Token Errors

**Error**: `TokenExpiredError: jwt expired`
**Cause**: Token lifetime exceeded (15 minutes for ScotAccount tokens)
**Solution**: Handle expiry gracefully and re-authenticate if needed

```javascript
try {
  const payload = jwt.verify(token, publicKey, options);
} catch (error) {
  if (error.name === 'TokenExpiredError') {
    // Redirect to re-authentication
    return res.redirect('/auth/login');
  }
  throw error;
}
```

### Audience Validation Failures

**Error**: `JsonWebTokenError: jwt audience invalid`
**Cause**: Token not intended for your client
**Solution**: Verify your client_id matches the token's audience

```javascript
// Ensure correct client ID
const payload = jwt.verify(idToken, publicKey, {
  audience: process.env.SCOTACCOUNT_CLIENT_ID  // Must match exactly
});
```

### Nonce Validation Failures

**Error**: `Invalid nonce - possible replay attack`
**Cause**: Nonce doesn't match or token being replayed
**Solution**: Ensure nonce storage and validation is working correctly

```javascript
// Store nonce securely during auth flow
req.session.authNonce = nonce;

// Validate on callback
if (payload.nonce !== req.session.authNonce) {
  throw new Error('Nonce mismatch');
}

// Clear nonce after use
delete req.session.authNonce;
```

---

## Security Best Practices

### Key Management
- **Cache JWKS**: Cache ScotAccount's public keys but refresh periodically
- **Handle Key Rotation**: ScotAccount rotates keys regularly - your code must handle new keys
- **Validate Key IDs**: Always check the `kid` header matches the key used

```javascript
// Good: Handle key rotation gracefully
const jwksClient = jwksClient({
  jwksUri: jwksUri,
  cache: true,
  cacheMaxAge: 600000,  // 10 minutes - allows for key rotation
  rateLimit: true,
  jwksRequestsPerMinute: 10
});
```

### Clock Skew Handling
- **Allow Tolerance**: Account for small time differences between servers
- **Not Too Much**: Keep tolerance minimal (5 seconds max)

```javascript
const payload = jwt.verify(token, publicKey, {
  clockTolerance: 5  // 5 seconds tolerance
});
```

### Error Handling
- **Secure Logging**: Log validation failures for security monitoring
- **User-Friendly Messages**: Don't expose technical details to users
- **Rate Limiting**: Implement rate limiting for repeated validation failures

```javascript
function handleValidationError(error, req, res) {
  // Log for security team (no sensitive data)
  logger.warn('Token validation failed', {
    error: error.message,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date()
  });

  // User-friendly response
  res.status(401).render('auth-error', {
    message: 'Authentication failed. Please sign in again.',
    loginUrl: '/auth/login'
  });
}
```

---

## Complete Validation Example

```javascript
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

class ScotAccountTokenValidator {
  constructor(config) {
    this.clientId = config.clientId;
    this.issuer = config.issuer;
    this.jwksClient = jwksClient({
      jwksUri: config.jwksUri,
      cache: true,
      cacheMaxAge: 600000,
      rateLimit: true
    });
  }

  async validateIdToken(idToken, nonce) {
    try {
      // Decode to get key information
      const decoded = jwt.decode(idToken, { complete: true });
      if (!decoded) {
        throw new Error('Invalid token format');
      }

      // Get public key
      const key = await this.jwksClient.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();

      // Verify signature and standard claims
      const payload = jwt.verify(idToken, publicKey, {
        issuer: this.issuer,
        audience: this.clientId,
        clockTolerance: 5
      });

      // Verify nonce
      if (payload.nonce !== nonce) {
        throw new Error('Invalid nonce');
      }

      return {
        userId: payload.sub,
        sessionId: payload.sid,
        issuedAt: new Date(payload.iat * 1000),
        expiresAt: new Date(payload.exp * 1000),
        valid: true
      };

    } catch (error) {
      throw new Error(`Token validation failed: ${error.message}`);
    }
  }

  async validateAccessToken(accessToken) {
    try {
      const decoded = jwt.decode(accessToken, { complete: true });
      if (!decoded) {
        throw new Error('Invalid access token format');
      }

      const key = await this.jwksClient.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();

      const payload = jwt.verify(accessToken, publicKey, {
        issuer: this.issuer,
        clockTolerance: 5
      });

      if (payload.cid !== this.clientId) {
        throw new Error('Token not issued for this client');
      }

      return {
        userId: payload.sub,
        scopes: payload.scp,
        clientId: payload.cid,
        expiresAt: new Date(payload.exp * 1000),
        valid: true
      };

    } catch (error) {
      throw new Error(`Access token validation failed: ${error.message}`);
    }
  }
}

// Usage
const validator = new ScotAccountTokenValidator({
  clientId: process.env.SCOTACCOUNT_CLIENT_ID,
  issuer: 'https://authz.integration.scotaccount.service.gov.scot',
  jwksUri: 'https://authz.integration.scotaccount.service.gov.scot/jwks.json'
});

// In your callback handler
try {
  const userInfo = await validator.validateIdToken(tokens.id_token, storedNonce);
  req.session.user = userInfo;
  res.redirect('/dashboard');
} catch (error) {
  handleValidationError(error, req, res);
}
```

---

## Related Pages

- **[Token Exchange](/implementation/token-exchange/)** - How to obtain tokens from ScotAccount
- **[Session Management](/implementation/session-management/)** - Managing user sessions after validation
- **[Error Handling](/implementation/error-handling/)** - Comprehensive error handling strategies
- **[Security Parameters](/implementation/security-parameters/)** - PKCE, state, and nonce implementation

---

*This page was last updated: [Date]*