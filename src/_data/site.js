// src/_data/site.js   (move from .json to .js)
module.exports = () => ({
  title: "ScotAccount Technical Documentation",
  description: "Technical documentation for ScotAccount - Scottish Government digital identity service",
  // Public origin used for absolute URLs (canonical, OG, sitemap)
  url: process.env.URL || "http://localhost:8080",

  // Project subfolder for GitHub Pages; works locally when using | url
  // Allow override via env for other deploys
  pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/sg-identity-techdocs/",

  author: "Scottish Government",
  language: "en-GB",
  locale: "en_GB",
  organization: {
    name: "Scottish Government",
    url: "https://www.gov.scot",
    logo: "/assets/scotgovlogo.png"
  },
 
});
