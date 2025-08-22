// Simple client-side search for ScotAccount documentation with Fuse.js fuzzy search
// Fuse.js is loaded globally via CDN and available as window.Fuse

class DocumentationSearch {
  constructor() {
    this.searchData = [];
    this.fuse = null;
    this.searchInput = null;
    this.searchResults = null;
    this.init();
  }

  async init() {
    await this.loadSearchData();
    this.setupFuse();
    this.setupSearchInterface();
    this.bindEvents();
  }

  async loadSearchData() {
    // Build search index from pages
    const pages = [
      {
        title: "Home",
        url: "/",
        content:
          "ScotAccount technical documentation Scottish Government identity authentication system getting started architecture",
      },
      {
        title: "Getting Started",
        url: "/getting-started/",
        content:
          "Quick start guide 30 minutes setup configuration authentication flow token validation OIDC OpenID Connect",
      },
      {
        title: "Architecture",
        url: "/architecture/",
        content:
          "System architecture components authentication service token validation identity provider OIDC flow sequence diagrams",
      },
      {
        title: "Complete Guide",
        url: "/scotaccount-complete-guide/",
        content:
          "Comprehensive implementation guide detailed setup configuration endpoints authentication flow security",
      },
      {
        title: "Token Validation Module",
        url: "/scotaccount-token-validation-module/",
        content:
          "Token validation security JWT verification authentication middleware implementation",
      },
      {
        title: "Modular Structure",
        url: "/scotaccount-modular-structure/",
        content:
          "Modular architecture design patterns components separation concerns implementation structure",
      },
      {
        title: "Integration Examples",
        url: "/integration-examples/",
        content:
          "Integration examples, practical implementation scenarios, documentation improvement recommendations, real-world use cases, step-by-step guides.",
      },
    ];
    this.searchData = pages;
  }

  setupFuse() {
    this.fuse = new window.Fuse(this.searchData, {
      keys: ["title", "content"],
      threshold: 0.4, // Lower = stricter, higher = fuzzier
      minMatchCharLength: 2,
      includeScore: true,
    });
  }

  setupSearchInterface() {
    // Get search input from header
    this.searchInput = document.getElementById("search-input");

    // Create search results container
    if (!document.getElementById("search-results")) {
      const resultsContainer = document.createElement("div");
      resultsContainer.id = "search-results";
      resultsContainer.className = "search-results";
      resultsContainer.style.display = "none";

      // Insert after search form
      const searchForm = document.querySelector(".sg-header__search-form");
      if (searchForm) {
        searchForm.parentNode.insertBefore(
          resultsContainer,
          searchForm.nextSibling
        );
      }
    }
    this.searchResults = document.getElementById("search-results");
  }

  bindEvents() {
    if (!this.searchInput) return;

    // Search on input
    this.searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim();
      if (query.length >= 2) {
        this.performSearch(query);
      } else {
        this.hideResults();
      }
    });

    // Handle search form submission
    const searchForm = document.querySelector(".sg-header__search-form");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = this.searchInput.value.trim();
        if (query.length >= 2) {
          this.performSearch(query);
        }
      });
    }

    // Hide results when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !e.target.closest(".sg-header__search") &&
        !e.target.closest(".search-results")
      ) {
        this.hideResults();
      }
    });

    // Keyboard navigation
    this.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.hideResults();
        this.searchInput.blur();
      }
    });
  }

  performSearch(query, renderToPage = false) {
    if (!this.fuse) return;
    const results = this.fuse.search(query).map((r) => r.item);
    if (renderToPage && document.getElementById("search-results-page")) {
      this.displayResultsPage(results, query);
    } else {
      this.displayResults(results, query);
    }
  }

  displayResults(results, query) {
    if (!this.searchResults) return;

    if (results.length === 0) {
      this.searchResults.innerHTML = `
        <div class="search-results__container">
          <div class="search-results__empty">
            <p>No results found for "${query}"</p>
            <p class="search-results__suggestion">Try searching for: authentication, token, OIDC, setup, or architecture</p>
          </div>
        </div>
      `;
    } else {
      const resultsHTML = results
        .map(
          (result) => `
        <div class="search-results__item">
          <a href="${result.url}" class="search-results__link">
            <h3 class="search-results__title">${result.title}</h3>
            <p class="search-results__summary">${this.getSearchSummary(
              result,
              query
            )}</p>
          </a>
        </div>
      `
        )
        .join("");

      this.searchResults.innerHTML = `
        <div class="search-results__container">
          <div class="search-results__header">
            <p class="search-results__count">${results.length} result$${
        results.length !== 1 ? "s" : ""
      } for "${query}"</p>
          </div>
          ${resultsHTML}
        </div>
      `;
    }

    this.searchResults.style.display = "block";
  }

  displayResultsPage(results, query) {
    const container = document.getElementById("search-results-page");
    if (!container) return;
    if (results.length === 0) {
      container.innerHTML = `
        <div class="search-results__container">
          <div class="search-results__empty">
            <p>No results found for "${query}"</p>
            <p class="search-results__suggestion">Try searching for: authentication, token, OIDC, setup, or architecture</p>
          </div>
        </div>
      `;
    } else {
      const resultsHTML = results
        .map(
          (result) => `
        <div class="search-results__item">
          <a href="${result.url}" class="search-results__link">
            <h3 class="search-results__title">${result.title}</h3>
            <p class="search-results__summary">${this.getSearchSummary(
              result,
              query
            )}</p>
          </a>
        </div>
      `
        )
        .join("");
      container.innerHTML = `
        <div class="search-results__container">
          <div class="search-results__header">
            <p class="search-results__count">${results.length} result$${
        results.length !== 1 ? "s" : ""
      } for "${query}"</p>
          </div>
          ${resultsHTML}
        </div>
      `;
    }
  }

  getSearchSummary(result, query) {
    // Extract relevant snippet from content
    const content = result.content.toLowerCase();
    const queryLower = query.toLowerCase();
    const index = content.indexOf(queryLower);

    if (index === -1) return result.content.substring(0, 120) + "...";

    const start = Math.max(0, index - 40);
    const end = Math.min(content.length, index + query.length + 40);
    let snippet = result.content.substring(start, end);

    if (start > 0) snippet = "..." + snippet;
    if (end < content.length) snippet = snippet + "...";

    return snippet;
  }

  hideResults() {
    if (this.searchResults) {
      this.searchResults.style.display = "none";
    }
  }
}

// Initialize search when DOM is loaded
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    if (window.Fuse) {
      window.__docSearchInstance = new DocumentationSearch();
    } else {
      // Load Fuse.js from CDN if not already loaded
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.min.js";
      script.onload = () => {
        window.__docSearchInstance = new DocumentationSearch();
      };
      document.body.appendChild(script);
    }
  });
}
