// src/_data/site.js
module.exports = () => ({
  title: "ScotAccount Technical Documentation",
  description:
    "Technical documentation for ScotAccount - Scottish Government digital identity service",

  // Used to build absolute URLs (canonical, OG, sitemap)
  // CI should set URL to your public origin.
  url: process.env.URL || "http://localhost:8080",

  // MUST mirror .eleventy.js -> pathPrefix
  pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/sg-identity-techdocs/",

  author: "Scottish Government",
  language: "en-GB",
  locale: "en_GB",

  organization: {
    name: "Scottish Government",
    url: "https://www.gov.scot",
    // ensure this file exists in your repo and is copied via passthrough
    logo: "assets/scotgovlogo.svg",
  },

});
