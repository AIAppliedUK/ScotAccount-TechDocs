# ScotAccount Technical Documentation

ScotAccount is Scotland's centralised digital identity service that provides government services with secure user authentication and access to verified personal information.

## What ScotAccount Provides

ScotAccount offers two core capabilities for government services:

- **User Authentication** - Verify users have a ScotAccount and receive a persistent user identifier (UUID)
- **Verified Attributes** - Access independently verified identity, address, and email data

All authentication is verified to **GPG45 Medium assurance level** through comprehensive identity verification processes.

---

## Get Started Quickly

### 🚀 For Developers
- **[Quick Start](/quick-start/)** - Get a working integration in 30 minutes
- **[Code Examples](/examples/)** - See complete implementation patterns
- **[Testing Guide](/testing/)** - Use our mock service for rapid development

### 📋 For Project Managers  
- **[How ScotAccount Works](/how-scotaccount-works/)** - Understand the service and benefits
- **[Planning Your Integration](/before-integrating/)** - Requirements and preparation steps
- **[Production Deployment](/production/)** - Go-live checklist and requirements

### 🔧 For Technical Architects
- **[Authentication Implementation](/implementation/)** - Complete technical integration guide
- **[Verified Attributes](/attributes/)** - Identity, address, and email verification
- **[API Reference](/api-reference/)** - Complete technical specifications

---

## Integration Journey

```mermaid
flowchart LR
    A[Plan Integration] --> B[Quick Start]
    B --> C[Test with Mock]
    C --> D[Build Authentication]
    D --> E[Add Verified Attributes]
    E --> F[Deploy to Production]
    
    style A fill:#e1f5fe
    style B fill:#e8f5e9
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style E fill:#e0f2f1
    style F fill:#fce4ec
```

**Typical Timeline**: 2-4 weeks from planning to production deployment

---

## Core Features

### Authentication
- **Persistent User Identity**: Each user receives a UUID that never changes
- **GPG45 Medium Assurance**: High confidence in user identity
- **Single Sign-On**: Users authenticate once across multiple government services
- **Secure by Design**: Built on OpenID Connect with PKCE, state management, and JWT validation

### Verified Attributes

| Attribute | Verification Method | Use Cases |
|-----------|-------------------|-----------|
| **Identity** | GPG45 Medium identity verification | Legal identity confirmation, age verification |
| **Address** | Credit reference agency checks | Service delivery, eligibility verification |
| **Email** | Email confirmation loop | Service communications, account recovery |

### Extended Verification Support
ScotAccount uniquely handles verification processes that can take days or weeks:
- Users can start verification on one device and complete on another
- Progress is automatically saved and resumed
- Cross-device completion is fully supported
- Your service receives results when verification completes

---

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
- **Standards-Based**: Built on OpenID Connect and OAuth 2.0
- **Comprehensive Documentation**: Complete guides and working examples
- **Testing Tools**: Mock service for rapid development and testing
- **Production Support**: Dedicated support for live service operation

---

## Recent Updates

| Date | Update | Section |
|------|---------|---------|
| Latest | Extended verification flow guidance | [Verified Attributes](/attributes/extended-verification/) |
| Latest | Cross-device scenario handling | [Attributes Guide](/attributes/cross-device/) |
| Latest | Enhanced error handling examples | [Implementation](/implementation/error-handling/) |
| Latest | Production monitoring guidance | [Production Deployment](/production/monitoring/) |

---

## Getting Help

### Technical Support
- **Integration Questions**: Contact the ScotAccount technical team
- **Documentation Issues**: [Report documentation problems](mailto:scotaccount-docs@gov.scot)
- **Service Status**: [Check service status and maintenance schedules](#)

### Community Resources
- **Developer Examples**: [GitHub repository with working code](#)
- **Best Practices**: [Community integration patterns](#)
- **Knowledge Base**: [Common questions and solutions](#)

### Emergency Support
For production issues affecting live services:
- **Emergency Contact**: [24/7 support for live service issues](#)
- **Status Page**: [Real-time service status updates](#)
- **Incident Reports**: [Historical incident information](#)

---

## Service Environments

### Integration Environment
**Purpose**: Development and testing
- **Discovery**: `https://authz.integration.scotaccount.service.gov.scot/.well-known/openid-configuration`
- **Registration**: Contact ScotAccount team for test service setup
- **Test Data**: Provided test users and scenarios available

### Mock Service  
**Purpose**: Rapid development and automated testing
- **Service URL**: `https://mock-dis.main.integration.scotaccount.service.gov.scot/v2/`
- **Benefits**: No registration required, predictable responses, fast iteration
- **Limitations**: Relaxed validation, simulated data only

### Production Environment
**Purpose**: Live service operation
- **Discovery**: `https://authz.scotaccount.service.gov.scot/.well-known/openid-configuration`
- **Requirements**: IP allowlisting, HTTPS endpoints, production keys
- **Support**: Dedicated production support team

---

**Ready to start?** → **[Begin with Quick Start](/quick-start/)** or **[Understand How ScotAccount Works](/how-scotaccount-works/)**

*This documentation was last updated: [Date] | [Report an issue](mailto:scotaccount-docs@gov.scot) | [View source](#)*