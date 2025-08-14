---
layout: base.njk
title: "ScotAccount Modular Structure"
description: "Understanding the modular structure and service organization of ScotAccount components"
eleventyNavigation:
  key: modular-structure
  order: 6
---

ScotAccount is built using a modular architecture that separates concerns and enables flexible integration patterns. This page explains the service organization and how different modules work together.

## Service Modules Overview

ScotAccount consists of several interconnected modules, each with specific responsibilities:

### Core Authentication Module

- **Primary responsibility**: User authentication and session management
- **Key features**: OpenID Connect authentication, JWT token issuance, session handling
- **Integration point**: All relying parties connect to this module for basic authentication

### Identity Verification Module (VerifyYourIdentity)

- **Primary responsibility**: GPG45 Medium assurance identity verification
- **Key features**: Document scanning, biometric verification, PEP/sanctions checks
- **Integration point**: Invoked when verified identity attributes are required

### Attribute Storage Module (mySafe)

- **Primary responsibility**: Secure storage and management of verified user data
- **Key features**: Encrypted data storage, consent management, attribute retrieval
- **Integration point**: Provides verified attributes to relying parties

### Consent Management Module

- **Primary responsibility**: User consent tracking and management
- **Key features**: Granular consent controls, audit trails, user self-service
- **Integration point**: Embedded in authentication flows requiring data sharing

## Module Integration Patterns

### Basic Authentication Pattern

```
Relying Party → Authentication Module → User Session
```

### Verified Attributes Pattern

```
Relying Party → Authentication Module → mySafe → Verified Attributes
```

### Identity Verification Pattern

```
User → VerifyYourIdentity → External Verification → mySafe → Attributes
```

## Module Responsibilities

### What Each Module Handles

**Authentication Module**:

- User registration and login
- OpenID Connect protocol implementation
- JWT token generation and validation
- Session lifecycle management
- Basic user profile data

**Identity Verification Module**:

- Document capture and verification
- Biometric identity matching
- External service integration (Experian, etc.)
- Verification workflow management
- Cross-device verification support

**Attribute Storage Module**:

- Encrypted storage of verified data
- Consent tracking and enforcement
- Data retrieval for authorized requests
- Audit logging and compliance
- Data retention and deletion

**Consent Management Module**:

- User consent collection
- Granular permission management
- Consent withdrawal handling
- Audit trail maintenance
- User preference management

## Integration Considerations

### Modular Integration Benefits

**Flexible Implementation**:

- Integrate only the modules you need
- Start with basic authentication, add verification later
- Independent module updates and maintenance

**Scalable Architecture**:

- Modules can scale independently
- Load balancing per module
- Fault isolation between modules

**Security by Design**:

- Module-level security boundaries
- Least privilege access patterns
- Independent security auditing

### Module Dependencies

**Core Dependencies**:

- Authentication Module: Required for all integrations
- Consent Management: Required when requesting verified attributes
- Identity Verification: Optional, based on service requirements
- Attribute Storage: Required for verified attribute access

**Optional Dependencies**:

- Address verification services
- Email verification services
- Additional external verification providers

## Development Approach

### Modular Development Strategy

1. **Start with Authentication Module**

   - Implement basic OpenID Connect integration
   - Establish user session management
   - Test authentication flows

2. **Add Consent Management**

   - Implement consent collection
   - Add granular permission controls
   - Test consent workflows

3. **Integrate Verification Module**

   - Add identity verification flows
   - Implement cross-device support
   - Test verification processes

4. **Enable Attribute Storage**
   - Access verified user data
   - Implement secure data handling
   - Test attribute retrieval

### Module Testing Approach

**Unit Testing**:

- Test each module independently
- Mock external module dependencies
- Validate module interfaces

**Integration Testing**:

- Test module communication
- Validate data flow between modules
- Test error handling across modules

**End-to-End Testing**:

- Test complete user journeys
- Validate cross-module functionality
- Test module fault tolerance

## Next Steps

<div class="callout callout--info">
<strong>Need implementation guidance?</strong> Start with the <a href="{{ '/getting-started/' | url }}">Getting Started guide</a> to implement the authentication module first.
</div>

<div class="callout callout--success">
<strong>Planning your architecture?</strong> Review the <a href="{{ '/architecture/' | url }}">Architecture Overview</a> to understand how modules fit together.
</div>

<div class="callout callout--warning">
<strong>Ready for detailed implementation?</strong> See the <a href="{{ '/scotaccount-complete-guide/' | url }}">Complete Implementation Guide</a> for comprehensive technical details.
</div>
