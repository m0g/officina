# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Officina website - a multilingual (English/German) Eleventy-powered static site for a Berlin-based creative coworking space. The site showcases their collective, artist residencies, events, and desk rental services.

## Common Development Commands

### Development
- `yarn start` - Starts development server with TailwindCSS watch mode and Eleventy hot reload
- `yarn dev` - Runs Eleventy in development mode with watch and serve
- `yarn tailwind` - Watches and compiles TailwindCSS styles

### Building
- `yarn build` - Builds production site with minified CSS to `_site/` directory
- `yarn prebuild` - Compiles and minifies TailwindCSS (runs automatically before build)

### Code Quality
- `yarn format` - Formats code using Prettier for JS, JSON, CSS, MD, and RB files
- Git hooks automatically format code on commit using husky and lint-staged

## Architecture

### Site Generator: Eleventy (11ty)
- **Input:** `src/` directory
- **Output:** `_site/` directory for production builds
- **Templates:** Nunjucks (`.njk`) files in `src/_includes/`
- **Content:** Markdown files in language-specific directories (`src/en/`, `src/de/`)

### Internationalization
- Uses `@11ty/eleventy` i18n plugin with English as default language
- Content organized in `src/en/` and `src/de/` directories
- Computed data in `src/_data/eleventyComputed.js` provides localized navigation menus
- URL structure: `/en/` and `/de/` for language-specific pages

### Content Management
- **Netlify CMS** configured in `src/admin/config.yml`
- Manages collections: site pages, artists, collective members, events
- Git-based workflow with git-gateway backend
- Media files stored in `src/_assets/images/uploads/`

### Styling & Assets
- **TailwindCSS** for styling with custom configuration in `tailwind.config.js`
- **PostCSS** with autoprefixer for CSS processing
- **IBM Plex** fonts integrated from npm package
- **Eleventy Image** plugin for optimized WebP image generation
- Assets in `src/_assets/` copied to build output

### Key Features
- **Image optimization:** Custom async shortcode using `@11ty/eleventy-img`
- **Interactive elements:** HTMX for progressive enhancement
- **Maps:** Leaflet integration for location display
- **Analytics:** PostHog integration with cookie consent banner
- **Responsive design:** TailwindCSS with custom breakpoints and utilities

### Content Structure
- **Collective members:** Individual markdown files in `src/en/collective/`
- **Artists:** Residency profiles in `src/en/artists/`
- **Events:** Event listings in `src/en/events/`
- **Pages:** Main site pages (about, desks, etc.) as markdown with custom layouts

### Deployment
- **Netlify** deployment configured in `netlify.toml`
- Build command: `npm run build`
- Publish directory: `_site/`
- Language-based redirects configured for home page

### Dependencies
Key runtime dependencies include HTMX for interactivity, PostHog for analytics, Leaflet for maps, and Universal Cookie for consent management.