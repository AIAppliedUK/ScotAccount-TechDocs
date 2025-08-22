// Generate search index data with proper path prefixes
module.exports = function() {
  const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || "/";
  
  // Helper to add path prefix to URLs
  const prefixUrl = (url) => {
    if (pathPrefix === "/") return url;
    return pathPrefix.replace(/\/$/, '') + url;
  };
  
  return {
    pages: [
      {
        title: "Home",
        url: prefixUrl("/"),
        content: "ScotAccount technical documentation Scottish Government identity authentication system getting started architecture"
      },
      {
        title: "Getting Started",
        url: prefixUrl("/getting-started/"),
        content: "Quick start guide 30 minutes setup configuration authentication flow token validation OIDC OpenID Connect"
      },
      {
        title: "Architecture",
        url: prefixUrl("/architecture/"),
        content: "System architecture components authentication service token validation identity provider OIDC flow sequence diagrams"
      },
      {
        title: "Implementation Guide",
        url: prefixUrl("/scotaccount-guide/"),
        content: "Implementation guide setup configuration endpoints authentication flow security best practices"
      },
      {
        title: "Complete Guide",
        url: prefixUrl("/scotaccount-complete-guide/"),
        content: "Comprehensive implementation guide detailed setup configuration endpoints authentication flow security"
      },
      {
        title: "Token Validation Module",
        url: prefixUrl("/scotaccount-token-validation-module/"),
        content: "Token validation JWT verification security JWKS public keys signature validation claims verification"
      },
      {
        title: "Integration Examples",
        url: prefixUrl("/integration-examples/"),
        content: "Code examples integration patterns Node.js Python Java C# .NET authentication flow implementation"
      },
      {
        title: "Modular Structure",
        url: prefixUrl("/scotaccount-modular-structure/"),
        content: "ScotAccount modular architecture components services API structure microservices design patterns"
      }
    ]
  };
};