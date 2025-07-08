# ScotAccount Technical Documentation - Modular Structure

## Proposed Site Structure

### 1. **Home Page** (`/`)
**Purpose**: Quick overview and navigation to key sections
```
# ScotAccount Technical Documentation

ScotAccount is Scotland's centralised digital identity service that provides government services with:
- User authentication with persistent identity
- Verified attribute data (identity, address, email)
- GPG45 Medium assurance level verification

## Get Started
- [Quick Start](/quick-start/) - Get up and running in 30 minutes
- [How ScotAccount Works](/how-scotaccount-works/) - Understand the concepts
- [Integration Examples](/examples/) - See working code samples

## Documentation Sections
- [Before You Integrate](/before-integrating/) - Planning and preparation
- [Test Your Integration](/testing/) - Mock service and validation strategies  
- [Implement Authentication](/implementation/) - Core integration guide
- [Request Verified Attributes](/attributes/) - Identity, address, and email verification
- [Deploy to Production](/production/) - Go-live checklist and monitoring

[View latest updates](#recent-changes)
```

---

### 2. **Quick Start** (`/quick-start/`)
**Purpose**: Get developers up and running quickly with working examples
```
# Quick Start

Get a working ScotAccount integration running in 30 minutes. Choose your path based on your needs:

| Method | Time | What You'll See |
|--------|------|-----------------|
| [Mock Service Integration](#mock-service-path) | 10 minutes | Authentication flow with simulated responses |
| [Integration Environment](#integration-environment-path) | 30 minutes | Real authentication with test accounts |
| [Code Examples Only](#code-examples-path) | 5 minutes | Review working implementation patterns |

## Mock Service Path (10 minutes)
Perfect for initial development and automated testing.

### Prerequisites
- Node.js 18+ or Python 3.8+
- Git

### Steps
1. Clone the example: `git clone [scotaccount-examples-repo]`
2. Install dependencies: `npm install`
3. Start the example: `npm run start:mock`
4. Visit `http://localhost:3000`
5. Click "Sign in with ScotAccount"

You'll see the complete authentication flow without needing any registration.

[View full mock service guide →](/testing/mock-service/)

## Integration Environment Path (30 minutes)
Test with real ScotAccount using test data.

### Prerequisites
- Government email address
- Basic cryptographic key generation

### Steps
1. [Generate your key pair](/before-integrating/generate-keys/)
2. [Register your service](/before-integrating/register-service/)
3. [Configure the example app](/quick-start/integration-setup/)
4. Test authentication and attribute flows

[Continue with integration environment →](/quick-start/integration-setup/)

## Next Steps
After completing quick start:
- [Understand how ScotAccount works](/how-scotaccount-works/)
- [Plan your full integration](/before-integrating/)
- [Implement production-ready authentication](/implementation/authentication/)
```

---

### 3. **How ScotAccount Works** (`/how-scotaccount-works/`)
**Purpose**: Conceptual overview before diving into implementation
```
# How ScotAccount Works

## Overview
ScotAccount provides two core capabilities for government services:
1. **Authentication** - Verify users have a ScotAccount and get persistent user ID
2. **Verified Attributes** - Access verified identity, address, and email data

## Authentication vs Verified Attributes

### Authentication (Always Required)
- Provides persistent UUID for user identification
- Users authenticate once with ScotAccount
- Verified to GPG45 Medium assurance level
- Required scope: `openid`

### Verified Attributes (Optional)
- Request additional verified information when needed
- **Identity**: GPG45 Medium verified name and date of birth
- **Address**: Credit reference agency verified postal address  
- **Email**: Verified email address from ScotAccount registration

## Technical Flow Overview
[Include your existing PlantUML architecture diagram]

## Why OpenID Connect?
[Brief explanation of OIDC benefits - security, standards compliance, etc.]

## Security Features
- **PKCE** protects against code interception
- **State parameter** prevents CSRF attacks
- **JWT signatures** ensure token authenticity
- **Client assertions** authenticate your service

## Extended Verification Journeys
ScotAccount's verification processes can take time:
- Users may take days/weeks to complete GPG45 verification
- Users can start on one device and finish on another
- ScotAccount manages verification state automatically
- Your service receives verification results when complete

[Learn how to handle extended verification →](/attributes/extended-verification/)

## Next Steps
- [Plan your integration requirements](/before-integrating/)
- [Start with quick examples](/quick-start/)
```

---

### 4. **Before You Integrate** (`/before-integrating/`)
**Purpose**: Planning and preparation section
```
# Before You Integrate

Before implementing ScotAccount, you need to plan your integration approach and prepare the necessary components.

## Planning Your Integration

Consider these factors:
- **Service scope**: What functionality requires authentication vs verified attributes?
- **User journey**: When do users need different levels of verification?
- **Data requirements**: Which verified attributes does your service need?
- **Cross-device scenarios**: How will you handle extended verification flows?

## Required Setup Steps

Complete these steps before starting implementation:

### 1. [Generate Cryptographic Keys](/before-integrating/generate-keys/)
Create RSA 3072-bit or EC P-256 key pairs for secure authentication.

### 2. [Choose Your Scopes](/before-integrating/choose-scopes/)
Determine which ScotAccount scopes your service requires:
- `openid` (required for all services)
- `scotaccount.gpg45.medium` (verified identity)
- `scotaccount.address` (verified address)
- `scotaccount.email` (verified email)

### 3. [Plan Your Service Configuration](/before-integrating/service-configuration/)
Define your redirect URIs, logout URIs, and service details.

### 4. [Register Your Service](/before-integrating/register-service/)
Submit registration information to the ScotAccount team.

### 5. [Set Up Network Access](/before-integrating/network-setup/)
Configure IP allowlisting for production deployments.

## Progressive Consent Strategy

Plan when to request different scopes:
- Start with basic authentication (`openid`)
- Request additional attributes only when needed
- Handle extended verification timeframes
- Design for cross-device completion

[Learn about progressive consent patterns →](/attributes/progressive-consent/)

## Next Steps
- [Set up your development environment](/testing/)
- [Implement basic authentication](/implementation/authentication/)
```

**Subsections:**
- `/before-integrating/generate-keys/` - Key generation guide
- `/before-integrating/choose-scopes/` - Scope selection guide  
- `/before-integrating/service-configuration/` - Configuration planning
- `/before-integrating/register-service/` - Registration process
- `/before-integrating/network-setup/` - IP allowlisting and network config

---

### 5. **Test Your Integration** (`/testing/`)
**Purpose**: Testing strategies and tools
```
# Test Your Integration

ScotAccount provides multiple testing approaches to support different development phases.

## Testing Environments

### Mock Service
**Best for**: Initial development, automated testing, CI/CD pipelines
- No registration required
- Predictable responses
- Simulates all OIDC flows
- Fast iteration cycles

[Use the mock service →](/testing/mock-service/)

### Integration Environment  
**Best for**: End-to-end testing, user acceptance testing
- Real ScotAccount protocols
- Actual user interfaces
- Full security measures
- Test user data available

[Use integration environment →](/testing/integration-environment/)

## Testing Strategy

### Phase 1: Development (Mock Service)
- Unit test your authentication logic
- Test error handling scenarios
- Validate token processing
- Build automated test suites

### Phase 2: Integration Validation (Integration Environment)
- End-to-end user journeys
- Real consent flows
- Security validation
- Performance testing

### Phase 3: Production Readiness
- Smoke tests
- Monitoring setup
- Error handling validation
- User experience testing

## Extended Verification Testing

Special considerations for GPG45 verification:
- Verification always succeeds in integration environment
- Design error handling based on specification
- Test cross-device scenarios manually
- Plan for stateless callback handling

[Learn about extended verification testing →](/testing/extended-verification/)

## Common Testing Scenarios
- [Successful authentication flow](/testing/scenarios/success/)
- [User cancellation scenarios](/testing/scenarios/cancellation/)
- [Token validation errors](/testing/scenarios/token-errors/)
- [Network failure handling](/testing/scenarios/network-errors/)
```

**Subsections:**
- `/testing/mock-service/` - Complete mock service guide
- `/testing/integration-environment/` - Integration testing guide
- `/testing/extended-verification/` - Extended verification testing
- `/testing/scenarios/` - Specific test scenarios

---

### 6. **Implement Authentication** (`/implementation/`)
**Purpose**: Core authentication implementation
```
# Implement Authentication

This section covers implementing the core OpenID Connect authentication flow with ScotAccount.

## Implementation Overview

Authentication with ScotAccount follows these steps:
1. [Discovery and Configuration](/implementation/discovery/)
2. [Generate Security Parameters](/implementation/security-parameters/)
3. [Build Authorization Request](/implementation/authorization-request/)
4. [Handle Authentication Callback](/implementation/callback-handling/)
5. [Exchange Code for Tokens](/implementation/token-exchange/)
6. [Validate ID Token](/implementation/token-validation/)
7. [Manage User Sessions](/implementation/session-management/)

## Core Integration Guide

### 1. Discovery and Configuration
Retrieve ScotAccount's current configuration dynamically:

```javascript
// Example configuration retrieval
const discovery = await fetch('https://authz.integration.scotaccount.service.gov.scot/.well-known/openid-configuration');
const config = await discovery.json();
```

[Full discovery implementation →](/implementation/discovery/)

### 2. Security Parameters (PKCE, State, Nonce)
Generate cryptographic security parameters:

```javascript
// PKCE parameters
const codeVerifier = generateCodeVerifier();
const codeChallenge = generateCodeChallenge(codeVerifier);

// CSRF protection
const state = generateSecureRandom();
const nonce = generateSecureRandom();
```

[Complete security parameter guide →](/implementation/security-parameters/)

### 3. Authorization Request
Build and redirect to ScotAccount:

```
GET https://authz.integration.scotaccount.service.gov.scot/authorize?
    client_id=your-client-id&
    redirect_uri=https://yourservice.gov.scot/callback&
    response_type=code&
    scope=openid&
    state=af0ifjsldkj&
    nonce=n-0S6_WzA2Mj&
    code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&
    code_challenge_method=S256
```

[Authorization request implementation →](/implementation/authorization-request/)

## Advanced Topics
- [Client Assertion Creation](/implementation/client-assertions/)
- [Error Handling Strategies](/implementation/error-handling/)
- [Session Timeout Management](/implementation/session-timeouts/)
- [Logout Implementation](/implementation/logout/)

## Code Examples
- [Complete Node.js Example](/examples/nodejs/)
- [Python Implementation](/examples/python/)
- [.NET Core Example](/examples/dotnet/)
```

**Subsections:**
- `/implementation/discovery/` - Discovery endpoint usage
- `/implementation/security-parameters/` - PKCE, state, nonce generation
- `/implementation/authorization-request/` - Building auth requests
- `/implementation/callback-handling/` - Processing callbacks
- `/implementation/token-exchange/` - Code to token exchange
- `/implementation/token-validation/` - JWT validation
- `/implementation/session-management/` - Session handling
- `/implementation/client-assertions/` - Client assertion JWTs
- `/implementation/error-handling/` - Comprehensive error handling
- `/implementation/logout/` - Logout implementation

---

### 7. **Request Verified Attributes** (`/attributes/`)
**Purpose**: Verified attributes implementation
```
# Request Verified Attributes

ScotAccount provides verified personal information that has been independently validated.

## Available Verified Attributes

### Identity (`scotaccount.gpg45.medium`)
**Verification**: GPG45 Medium assurance through document and database checks
**Data**: Given name, family name, date of birth
**Use cases**: Legal identity verification, age verification

### Address (`scotaccount.address`)  
**Verification**: Credit reference agency checks
**Data**: Full postal address with UPRN
**Use cases**: Service delivery, eligibility verification

### Email (`scotaccount.email`)
**Verification**: Email confirmation loop during registration
**Data**: Verified email address
**Use cases**: Service communications, account recovery

## Implementation Patterns

### Progressive Consent
Request attributes only when needed:

```javascript
// Start with basic authentication
const basicAuthUrl = buildAuthUrl(['openid']);

// Later, request identity verification
const identityAuthUrl = buildAuthUrl(['openid', 'scotaccount.gpg45.medium']);
```

### Extended Verification Handling
GPG45 verification can take time:

```javascript
// Handle cross-device completion
if (callbackState && !stateExists(callbackState)) {
    // Check for pending verification
    const pendingVerification = checkPendingVerification(userId);
    if (pendingVerification) {
        showVerificationStatus(pendingVerification);
    }
}
```

## Verification Response Format

```json
{
  "verified_claims": [
    {
      "scope": "scotaccount.gpg45.medium",
      "verification": {
        "outcome": "VERIFIED_SUCCESSFULLY",
        "trust_framework": "uk_tfida",
        "confidence_level": "medium",
        "time": "2024-03-15T14:30:00Z"
      },
      "claims": {
        "given_name": "John",
        "family_name": "Smith", 
        "birth_date": "1990-05-15"
      }
    }
  ]
}
```

## Implementation Guides
- [Progressive Consent Patterns](/attributes/progressive-consent/)
- [Extended Verification Flows](/attributes/extended-verification/)
- [Cross-Device Handling](/attributes/cross-device/)
- [Attribute Data Processing](/attributes/data-processing/)
- [User Experience Patterns](/attributes/user-experience/)
```

**Subsections:**
- `/attributes/progressive-consent/` - Progressive consent implementation
- `/attributes/extended-verification/` - Extended verification flows
- `/attributes/cross-device/` - Cross-device scenario handling
- `/attributes/data-processing/` - Processing attribute responses
- `/attributes/user-experience/` - UX patterns for verification

---

### 8. **Deploy to Production** (`/production/`)
**Purpose**: Production deployment and operations
```
# Deploy to Production

Move your ScotAccount integration from development to production.

## Production Environment Differences

### Security Requirements
- **IP Allowlisting**: Register all production IP addresses
- **HTTPS Only**: All redirect URIs must use HTTPS
- **Key Management**: Generate new keys (never reuse development keys)
- **Secret Storage**: Use dedicated secret management systems

### Configuration Updates
- **Discovery Endpoint**: `https://authz.scotaccount.service.gov.scot/.well-known/openid-configuration`
- **Redirect URIs**: Update to production URLs
- **Logout URIs**: Update to production endpoints

## Pre-Production Checklist

### Security ✓
- [ ] Generate new RSA 3072-bit or EC P-256 keys for production
- [ ] Store private keys in secure key management system
- [ ] Register production public key with ScotAccount
- [ ] Provide complete list of production IP addresses
- [ ] Update all URIs to use HTTPS

### Configuration ✓
- [ ] Update discovery endpoint to production
- [ ] Configure production client_id
- [ ] Update redirect and logout URIs
- [ ] Test configuration in staging environment

### Monitoring ✓
- [ ] Implement authentication success/failure monitoring
- [ ] Set up token validation error tracking
- [ ] Configure security event alerting
- [ ] Create operational dashboards

### Operations ✓
- [ ] Document support procedures
- [ ] Establish communication with ScotAccount support
- [ ] Plan for maintenance windows
- [ ] Test incident response procedures

## Operational Considerations

### Monitoring Metrics
- Authentication success/failure rates
- Token validation errors
- Discovery endpoint availability
- JWKS endpoint accessibility
- User session patterns

### Error Handling
- Network connectivity issues
- Service maintenance periods
- Token expiration scenarios
- User session timeouts

### Security Monitoring
- Unusual authentication patterns
- Repeated authentication failures
- Configuration validation errors
- Potential security incidents

[Complete monitoring guide →](/production/monitoring/)
[Incident response procedures →](/production/incident-response/)
```

**Subsections:**
- `/production/configuration/` - Production configuration guide
- `/production/monitoring/` - Monitoring and alerting setup  
- `/production/incident-response/` - Support and incident procedures
- `/production/security/` - Production security considerations

---

### 9. **Code Examples** (`/examples/`)
**Purpose**: Working implementation examples
```
# Code Examples

Complete working examples for different platforms and languages.

## Quick Reference Examples

### Client Assertion Creation
```javascript
function createClientAssertion(clientId, audience, privateKey) {
    const payload = {
        iss: clientId,
        sub: clientId, 
        aud: audience,
        exp: Math.floor(Date.now() / 1000) + 300,
        iat: Math.floor(Date.now() / 1000),
        jti: crypto.randomUUID()
    };
    
    return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}
```

### Token Validation
```javascript
async function validateIdToken(idToken, clientId, nonce, jwksClient) {
    const decoded = jwt.decode(idToken, { complete: true });
    const key = await jwksClient.getSigningKey(decoded.header.kid);
    
    const payload = jwt.verify(idToken, key.getPublicKey(), {
        issuer: 'https://authz.integration.scotaccount.service.gov.scot',
        audience: clientId
    });
    
    if (payload.nonce !== nonce) {
        throw new Error('Invalid nonce');
    }
    
    return payload;
}
```

## Complete Implementation Examples

### [Node.js Express Integration](/examples/nodejs/)
Full working Express.js application with:
- Authentication flow implementation
- Verified attributes handling
- Extended verification support
- Error handling and logging

### [Python FastAPI Integration](/examples/python/)
Complete FastAPI implementation covering:
- OIDC flow implementation
- JWT validation
- Session management
- Attribute processing

### [.NET Core Integration](/examples/dotnet/)
ASP.NET Core implementation with:
- OpenID Connect middleware configuration
- Custom claim processing
- ScotAccount-specific adaptations

## Integration Patterns

### [Progressive Consent Example](/examples/progressive-consent/)
Demonstrates requesting additional scopes when needed.

### [Extended Verification Example](/examples/extended-verification/)
Shows handling of GPG45 verification flows that span multiple sessions.

### [Cross-Device Flow Example](/examples/cross-device/)
Handles users completing verification on different devices.

### [Error Handling Patterns](/examples/error-handling/)
Comprehensive error handling for all integration scenarios.
```

---

### 10. **API Reference** (`/api-reference/`)
**Purpose**: Technical API specifications
```
# API Reference

Complete technical reference for ScotAccount endpoints and data formats.

## Endpoints

### Discovery Endpoint
```
GET /.well-known/openid-configuration
```
Returns current ScotAccount configuration and supported features.

### Authorization Endpoint  
```
GET /authorize
```
Initiates authentication flow with required parameters.

### Token Endpoint
```
POST /token
```
Exchanges authorization code for access tokens and ID tokens.

### Attributes Endpoint
```
GET /attributes/values
```
Retrieves verified user attributes using access token.

### Logout Endpoint
```
GET /authorize/logout
```
Terminates user session with ScotAccount.

## Data Schemas

### ID Token Claims
### Access Token Claims  
### Verified Claims Structure
### Error Response Formats

[View complete API specifications →](/api-reference/complete-spec/)
```

---

## Benefits of This Modular Structure

### For Maintenance
- **Easier updates**: Modify individual sections without affecting others
- **Version control**: Track changes to specific topics
- **Content ownership**: Different teams can maintain different sections
- **Reduced conflicts**: Multiple people can work on documentation simultaneously

### For Users  
- **Progressive learning**: Follow logical path from planning to production
- **Focused content**: Each page addresses one specific topic
- **Better navigation**: Find specific information quickly
- **Multiple entry points**: Quick start for urgent needs, detailed guides for thorough understanding

### For Publication
- **Faster builds**: Only rebuild changed sections
- **Better SEO**: Focused pages rank better for specific topics
- **Analytics**: Track which sections are most/least used
- **A/B testing**: Test different approaches for specific topics

## Implementation Approach

1. **Phase 1**: Create the new modular structure
2. **Phase 2**: Extract content from existing document into appropriate sections
3. **Phase 3**: Add cross-references and navigation between sections
4. **Phase 4**: Optimize each section for its specific purpose
5. **Phase 5**: Add section-specific examples and code samples

This structure maintains all your excellent ScotAccount-specific technical content while making it much more professional, maintainable, and user-friendly. Each section can be independently updated and maintained, following the successful pattern established by OneLogin's documentation.
