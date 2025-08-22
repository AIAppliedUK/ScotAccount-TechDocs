# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the ScotAccount Technical Documentation project - a static documentation site for Scotland's digital identity service built with Eleventy and styled with Scottish Government design principles.

## Development Commands

### Core Commands
```bash
npm install          # Install dependencies
npm run dev          # Start development server with hot reload (port 8000)
npm run build        # Build for production with GitHub Pages path prefix
npm run clean        # Clean generated files in _site/
```

### Alternative Commands
```bash
npm start            # Start development server (without watch)
npm run watch        # Build and watch for changes (no server)
npm run build:production  # Build with NODE_ENV=production
```

### Docker Commands
```bash
docker-compose up -d     # Start containerized site on port 8000
docker build -t scotaccount-docs .  # Build Docker image
docker run -p 8000:8000 scotaccount-docs  # Run container
```

## Architecture

### Technology Stack
- **Eleventy (11ty)** - Static site generator
- **Nunjucks** - Template engine for layouts
- **Markdown-it** - Markdown processor with plugins for anchors and TOC
- **Fuse.js** - Client-side search functionality

### Project Structure
- `src/` - Source content and templates
  - `_data/site.json` - Global site configuration and navigation
  - `_layouts/base.njk` - Main layout template
  - `*.md` - Content pages in Markdown
  - `css/main.css` - Scottish Government styled CSS
  - `js/search.js` - Search functionality
  - `assets/` - Images, diagrams, and favicons
- `_site/` - Generated static site (do not edit)
- `.eleventy.js` - Eleventy configuration with plugins and filters

### Key Configuration
- **Path Prefix**: `/sg-identity-techdocs/` for GitHub Pages deployment
- **Markdown Engine**: Enhanced with header anchors and table of contents support
- **Navigation**: Defined in `src/_data/site.json`, uses eleventy-navigation plugin
- **Static Assets**: CSS, JS, and images are passed through without processing

### Content Management
- Pages use frontmatter for metadata (title, description, navigation)
- Navigation order controlled by `eleventyNavigation.order` property
- Markdown supports HTML, line breaks, and auto-linking
- Custom filters: `dateDisplay`, `slugify`

### Deployment
- GitHub Actions workflow builds and deploys to GitHub Pages
- Production builds use path prefix for correct asset URLs
- Docker deployment available for containerized hosting