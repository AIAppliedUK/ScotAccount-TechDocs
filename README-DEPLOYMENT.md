# Deployment Configuration Guide

This document explains how to deploy the ScotAccount Technical Documentation to different GitHub Pages environments.

## Understanding the Deployment Scenarios

### Public GitHub Pages
- **URL Pattern**: `https://[username].github.io/[repository-name]/`
- **Example**: `https://scotaccount.github.io/sg-identity-techdocs/`
- **Path Prefix Required**: Yes (`/sg-identity-techdocs/`)
- **Use Case**: Public repository with standard GitHub Pages

### Private GitHub Pages
- **URL Pattern**: Dynamic URL provided by GitHub for private repositories
- **Example**: `https://[dynamic-subdomain].pages.github.io/`
- **Path Prefix Required**: No (served from root `/`)
- **Use Case**: Private repository with GitHub Pages enabled

## Build Commands

### For Local Development

```bash
# Default development (no path prefix)
npm run dev

# Development with public GitHub Pages prefix
npm run dev:public

# Development for private GitHub Pages (explicit no prefix)
npm run dev:private
```

### For Production Builds

```bash
# Default build (uses environment variable or no prefix)
npm run build

# Build for public GitHub Pages
npm run build:public

# Build for private GitHub Pages
npm run build:private
```

## Environment Variables

The build system uses these environment variables:

- `ELEVENTY_PATH_PREFIX`: Sets the base path for all URLs
  - For public pages: `/sg-identity-techdocs/`
  - For private pages: `/` (or omit entirely)
- `URL`: The full base URL of the deployment

## GitHub Actions Workflow

The `.github/workflows/deploy.yml` workflow supports both private and public deployments with manual control.

### How to Deploy

1. Go to the **Actions** tab in your GitHub repository
2. Select **"Deploy Eleventy to GitHub Pages"** workflow
3. Click **"Run workflow"** button
4. Choose your deployment type:
   - **Private** (default): For internal review, no path prefix
   - **Public**: For public GitHub Pages with `/sg-identity-techdocs/` prefix
5. Optionally provide a custom URL for private deployments
6. Click **"Run workflow"** to start the deployment

### Deployment Workflow

```
Internal Review (Private) → Test & Validate → Public Deployment
```

1. **Initial Development**: Deploy as "private" for internal review
2. **Review Process**: Team reviews the documentation internally
3. **Public Release**: Once approved, deploy as "public" for external access

### Automatic Deployment (Optional)

The workflow includes commented-out code for automatic deployment on push to main. To enable:

1. Edit `.github/workflows/deploy.yml`
2. Uncomment lines 22-23:
   ```yaml
   push:
     branches: [main]
   ```
3. This will automatically deploy as "private" on every push to main

## Testing Your Configuration

### Test Public Pages Build Locally
```bash
ELEVENTY_PATH_PREFIX=/sg-identity-techdocs/ npm run build
# Then serve the _site directory and verify all links work
```

### Test Private Pages Build Locally
```bash
ELEVENTY_PATH_PREFIX=/ npm run build
# Or simply:
npm run build:private
```

## How It Works

1. **Dynamic Configuration**: The `src/_data/site.js` file dynamically reads environment variables
2. **Eleventy Config**: The `.eleventy.js` file uses `process.env.ELEVENTY_PATH_PREFIX` to set the path prefix
3. **Template URLs**: All templates use the `| url` filter which automatically applies the correct prefix
4. **Asset References**: CSS, JS, and image paths all use the `| url` filter for correct resolution

## Troubleshooting

### Links Not Working in Private Deployment
- Ensure you're using `npm run build:private` or setting `ELEVENTY_PATH_PREFIX=/`
- Verify all template URLs use the `| url` filter

### Assets Not Loading
- Check that all asset references in templates use `{{ '/path/to/asset' | url }}`
- Don't hardcode paths with the prefix

### Wrong Path Prefix Applied
- Clear the `_site` directory: `npm run clean`
- Rebuild with the correct command for your deployment type

## Migration from JSON to JS Configuration

The site configuration has been migrated from `site.json` to `site.js` to support dynamic environment-based configuration. The old `site.json` has been backed up as `site.json.bak` and can be removed once you've verified the new configuration works correctly.