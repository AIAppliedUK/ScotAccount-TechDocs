// .eleventy.js
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItTOC = require("markdown-it-table-of-contents");

module.exports = function (eleventyConfig) {
  // --- Filters FIRST (so they exist for anything below) ---
  eleventyConfig.addFilter("dateDisplay", (date) =>
    new Date(date).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
  );

  // Simple, robust slugify
  const slugify = (str) =>
    String(str)
      .toLowerCase()
      .normalize("NFKD")                 // handle accents
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  eleventyConfig.addFilter("slugify", slugify);

  // For canonical/OG: build absolute URLs
  eleventyConfig.addFilter("absoluteUrl", (path, base) => new URL(path, base).toString());

  // --- Plugins ---
  // Do NOT use EleventyHtmlBasePlugin; we rely on |url + pathPrefix
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);

  // --- Passthroughs ---
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/assets");

  // Favicons to root
  eleventyConfig.addPassthroughCopy({ "src/assets/favicons/favicon.ico": "favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "src/assets/favicons/apple-touch-icon.png": "apple-touch-icon.png" });
  eleventyConfig.addPassthroughCopy({ "src/assets/favicons/favicon-32x32.png": "favicon-32x32.png" });
  eleventyConfig.addPassthroughCopy({ "src/assets/favicons/favicon-16x16.png": "favicon-16x16.png" });
  eleventyConfig.addPassthroughCopy({ "src/assets/favicons/safari-pinned-tab.svg": "safari-pinned-tab.svg" });

  // These two are redundant because of `eleventyConfig.addPassthroughCopy("src/assets")`,
  // but harmless—feel free to remove them:
  eleventyConfig.addPassthroughCopy("src/assets/scottish-government-logo.svg");
  eleventyConfig.addPassthroughCopy("src/assets/scottish-flag.svg");
  eleventyConfig.addPassthroughCopy("src/assets/scottish-gov-logo.svg");

  // --- Markdown ---
  const md = markdownIt({ html: true, breaks: true, linkify: true, typographer: true })
    .use(markdownItAnchor, {
      // Use the local slugify (don’t call getFilter here)
      slugify,
      permalink: markdownItAnchor.permalink.headerLink({
        safariReaderFix: true,
        class: "header-anchor",
        symbol: "#",
        style: "visually-hidden",
        assistiveText: (title) => `Permalink to "${title}"`,
        visuallyHiddenClass: "visually-hidden",
      }),
      level: [1, 2, 3, 4],
    })
    .use(markdownItTOC, {
      includeLevel: [2, 3, 4],
      containerClass: "table-of-contents",
      markerPattern: /^\[\[toc\]\]/im,
    });

  eleventyConfig.setLibrary("md", md);

  // --- Directories & engines ---
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",

    // MUST match site.pathPrefix in _data/site.js
    // pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/sg-identity-techdocs/",
  };
};
