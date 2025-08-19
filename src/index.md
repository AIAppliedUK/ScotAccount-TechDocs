---
layout: base.njk
title: "ScotAccount Technical Documentation"
description: "Scotland's centralised digital identity service providing secure user authentication and access to verified personal information for government services"
eleventyNavigation:
  key: home
  order: 1
---

## What ScotAccount Provides

ScotAccount offers two core capabilities for government services:

- **User Authentication** - Verify users have a ScotAccount and receive a persistent user identifier (UUID)
- **Verified Attributes** - Access independently verified identity, address, and email data

When a use completes the verification process their identity verified to **GPG45 Medium assurance level** through comprehensive identity verification processes.

## Get Started Quickly

- **[Quick Start Guide]({{ '/getting-started/' | url }})** - Get a working integration quickly
- **[Implementation Guide]({{ '/scotaccount-guide/' | url }})** - High level implementation guide
- **[Comprehensive Guide]({{ '/scotaccount-complete-guide/' | url }})** - Comprehensive implementation guide detailing the implementation
- **[Token Validation]({{ '/scotaccount-token-validation-module/' | url }})** - Secure token handling
- **[Token Validation Module]({{ '/scotaccount-token-validation-module/' | url }})** - Secure token verification

## Integration Journey

### Phase 1: Planning and Setup

1. Review architecture and requirements
2. Set up development environment
3. Configure initial authentication flow

### Phase 2: Implementation

1. Implement OpenID Connect authentication
2. Add token validation
3. Integrate verified attributes

### Phase 3: Testing and Deployment

1. Test with mock or integration environment
2. Verify all of your journeys and scenario permutations.
3. Production deployment and monitoring

## Core Features

### Authentication

- **Persistent User Identity**: Each user receives a unique UUID that never changes
- **GPG45 Medium Assurance**: High confidence in user verified identity
- **Single Sign-On**: Users authenticate once across multiple government services
- **Secure by Design**: Built on OpenID Connect with PKCE, state management, and JWT validation

### Verified Attributes

| Attribute    | Verification Method                | Use Cases                                     |
| ------------ | ---------------------------------- | --------------------------------------------- |
| **Identity** | GPG45 Medium identity verification | Legal identity confirmation, age verification |
| **Address**  | Credit reference agency checks     | Service delivery, eligibility verification    |
| **Email**    | Email confirmation loop            | Service communications, account recovery      |
| **Mobile**   | Text Message confirmation loop     | Service communications, account recovery      |

### Extended Verification Support

ScotAccount uniquely handles verification processes that can minutes or days:

- Users can start verification on one device and verify information on their mobile.
- Progress is automatically saved and resumed
- Your service receives results when verification completes

## Why Choose ScotAccount?

### For Government Services

- **Reduced Development Time**: No need to build authentication systems
- **Enhanced Security**: Built-in protection against common web attacks
- **Compliance Ready**: Data protection and audit capabilities included
- **Verified Data**: Access to independently validated user information

### For Users

- **Single Account**: One login for multiple government services
- **Data Control**: Users choose what information to share with each service
- **Secure Experience**: Industry-standard security with user-friendly interface
- **Device Flexibility**: Complete verification across multiple devices

### For Technical Teams

- **Standards-Based**: Built on OpenID Connect
- **Comprehensive Documentation**: Complete guides and working examples
- **Testing Tools**: Mock service for rapid development and testing
- **Production Support**: Dedicated support for live service operation

## Next Steps

Choose your path based on your role:

<div class="callout callout--info">
<strong>New to ScotAccount?</strong> Start with our <a href="{{ '/getting-started/' | url }}">Getting Started guide</a> to understand the basics and set up your first integration.
</div>

<div class="callout callout--success">
<strong>Ready to implement?</strong> Jump into the <a href="{{ '/scotaccount-complete-guide/' | url }}">Complete Implementation Guide</a> for detailed technical instructions.
</div>

<div class="callout callout--warning">
<strong>Need architecture details?</strong> Review the <a href="{{ '/architecture/' | url }}">Architecture Overview</a> to understand system components and data flows.
</div>
