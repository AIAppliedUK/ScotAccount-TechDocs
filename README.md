# ScotAccount Technical Documentation

Modern technical documentation for ScotAccount – Scotland's digital identity service, built with Eleventy and styled with Scottish Government design principles.

## Features

- **Scottish Government Design System** – Authentic gov.scot styling and branding
- **Optimised for Web Reading** – Nielsen Norman Group guidelines
- **Mobile-First Responsive** – Works on all devices
- **Accessible** – WCAG 2.1 AA compliant
- **Fast and Secure** – Static site generation with security headers
- **Container Ready** – Docker and docker-compose for easy deployment
- **GitHub Pages Ready** – Automated deployment with GitHub Actions

## Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start development server:**
   ```bash
   npm run dev
   ```
3. **Open your browser** to `http://localhost:8000`

The site will automatically reload when you make changes to files in the `src/` directory.

### Building for Production

1. **Build the site:**
   ```bash
   npm run build
   ```

## GitHub Pages Deployment (Recommended)

This project is set up for automatic deployment to GitHub Pages using GitHub Actions.

- On every push to `main`, a workflow builds the site and publishes the output from `_site/` to the `gh-pages` branch.
- The site is then available at:
  `https://<your-username>.github.io/<your-repo-name>/`

**To enable:**

1. Go to your repository’s **Settings → Pages** and set the source to **GitHub Actions**.
2. Check the **Actions** tab for deployment status.

## Docker Deployment

### Using Docker Compose

1. **Start the container:**
   ```bash
   docker-compose up -d
   ```
2. **View the site** at `http://localhost:8000`

### Using Docker directly

1. **Build the image:**
   ```bash
   docker build -t scotaccount-docs .
   ```
2. **Run the container:**
   ```bash
   docker run -p 8000:8000 scotaccount-docs
   ```

## Project Structure

```
├── src/                          # Source content and templates
│   ├── _data/                   # Global data files
│   ├── _includes/               # Reusable template components
│   ├── _layouts/                # Page layout templates
│   ├── css/                     # Stylesheets
│   ├── js/                      # JavaScript (search, etc.)
│   ├── assets/                  # Images, logos, favicons
│   ├── *.md                     # Content pages (Markdown)
│   └── index.md                 # Homepage
├── _site/                       # Generated site (after build)
├── .eleventy.js                  # Eleventy configuration
├── package.json                  # Node.js dependencies
├── Dockerfile                    # Production container
├── docker-compose.yml            # Container orchestration
├── .github/workflows/deploy.yml  # GitHub Actions workflow
└── README.md                     # This file
```

## Scottish Government Design

The site implements a design system inspired by [gov.scot](https://www.gov.scot) with:

- **Scottish Government blue** (#0065bd) as the primary colour
- **Helvetica Neue** typography for readability
- **Clear visual hierarchy** with proper heading structures
- **Scannable content** with bulleted lists and highlighted keywords
- **Accessible design** with proper contrast ratios and focus indicators

## Content Guidelines

Content follows web reading best practices:

- **Scannable structure** – Clear headings, bullet points, short paragraphs
- **Highlighted keywords** – Important terms in bold for easy scanning
- **One idea per paragraph** – Focused content that's easy to digest
- **Inverted pyramid** – Key information first, details later
- **Concise writing** – Optimised for web reading

## Development

### VSCode Integration

- **Tasks** (`Ctrl+Shift+P` → "Tasks: Run Task"):
  - `Install Dependencies` – Install npm packages
  - `Serve Eleventy` – Start development server
  - `Build Site` – Build for production
  - `Clean Build` – Remove generated files
- **Launch Configurations** (`F5` or Run and Debug):
  - `Serve Eleventy Development` – Start dev server with debugging
  - `Build Eleventy Production` – Build for production
  - `Serve Production Build` – Test production build locally

### Available Scripts

```bash
npm run start       # Start development server
npm run dev         # Start development server with watch
npm run build       # Build for production
npm run clean       # Remove generated files
npm run build:production  # Build with production optimisations
```

### Content Editing

1. **Pages** are written in Markdown in the `src/` directory
2. **Navigation** is configured in `src/_data/site.json`
3. **Layouts** use Nunjucks templates in `src/_layouts/`
4. **Styles** are in `src/css/main.css`

### Adding New Pages

1. Create a new `.md` file in `src/`
2. Add frontmatter with title, description, and navigation:
   ```yaml
   ---
   layout: base.njk
   title: "Page Title"
   description: "Page description for SEO"
   eleventyNavigation:
     key: page-key
     order: 5
   ---
   ```
3. Add the page to navigation in `src/_data/site.json`

## Security Features

- **Security headers** – CSP, HSTS, X-Frame-Options, etc.
- **Content Security Policy** – Prevents XSS attacks
- **HTTPS only** – Secure connections enforced
- **No sensitive data** – Static site with no server-side secrets
- **Regular updates** – Dependencies kept current

## Performance

- **Static site generation** – Fast loading times
- **Minimal JavaScript** – Only essential functionality
- **Optimised images** – Compressed and responsive
- **Gzip compression** – Reduced transfer sizes
- **CDN-ready** – Optimised for global content delivery

## Support

### Common Issues

**Build fails with missing dependencies:**

```bash
rm -rf node_modules package-lock.json
npm install
```

**Port already in use:**

```bash
# Kill process using port 8000
lsof -ti:8000 | xargs kill -9
```

**Docker build fails:**

```bash
# Clean Docker cache
docker system prune -a
```

### Getting Help

- **Documentation issues** – Open an issue in this repository
- **ScotAccount integration** – Contact the ScotAccount team
- **Technical support** – Refer to the complete implementation guides

## License

This documentation is available under the [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).

## Built With

- **[Eleventy](https://www.11ty.dev/)** – Static site generator
- **[Nunjucks](https://mozilla.github.io/nunjucks/)** – Template engine
- **[Markdown-it](https://github.com/markdown-it/markdown-it)** – Markdown processor
- **[Docker](https://www.docker.com/)** – Containerisation

---

**© Crown Copyright** – Scottish Government  
All content is available under the Open Government Licence v3.0, except where otherwise stated.
