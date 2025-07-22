const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItTOC = require("markdown-it-table-of-contents");

module.exports = function (eleventyConfig) {
  // Add plugins
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);

  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/assets/scotgovlogo.svg");

  // Copy favicon files to root (Scottish Government style)
  eleventyConfig.addPassthroughCopy({
    "src/assets/favicons/favicon.ico": "favicon.ico",
  });
  eleventyConfig.addPassthroughCopy({
    "src/assets/favicons/apple-touch-icon.png": "apple-touch-icon.png",
  });
  eleventyConfig.addPassthroughCopy({
    "src/assets/favicons/favicon-32x32.png": "favicon-32x32.png",
  });
  eleventyConfig.addPassthroughCopy({
    "src/assets/favicons/favicon-16x16.png": "favicon-16x16.png",
  });
  eleventyConfig.addPassthroughCopy({
    "src/assets/favicons/safari-pinned-tab.svg": "safari-pinned-tab.svg",
  });

  // Copy official Scottish Government assets
  eleventyConfig.addPassthroughCopy("src/assets/scottish-government-logo.svg");
  eleventyConfig.addPassthroughCopy("src/assets/scottish-flag.svg");
  eleventyConfig.addPassthroughCopy("src/assets/scottish-gov-logo.svg");

  // Configure Markdown
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  })
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink({
        safariReaderFix: true,
        class: "header-anchor",
        symbol: "#",
        style: "visually-hidden",
        assistiveText: (title) => `Permalink to "${title}"`,
        visuallyHiddenClass: "visually-hidden",
      }),
      level: [1, 2, 3, 4],
      slugify: eleventyConfig.getFilter("slugify"),
    })
    .use(markdownItTOC, {
      includeLevel: [2, 3, 4],
      containerClass: "table-of-contents",
      markerPattern: /^\[\[toc\]\]/im,
    });

  eleventyConfig.setLibrary("md", markdownLibrary);

  // Add custom filters
  eleventyConfig.addFilter("dateDisplay", function (date) {
    return new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("slugify", function (str) {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  });

  // Configure directories
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
  };
};
