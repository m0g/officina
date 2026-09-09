# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site for Officina Kreuzberg, a member-run coworking space in Berlin. Eleventy 2 + Nunjucks + Tailwind 3, edited through Decap CMS, deployed on Netlify. Node 22 / yarn 1 (`.tool-versions`). There is no test suite and no linter — only `yarn format` (Prettier, also run on staged files by husky + lint-staged).

## Commands

```bash
yarn install
yarn start    # dev: tailwind --watch + eleventy --serve concurrently (http://localhost:8080)
yarn build    # prod: prebuild runs tailwind --minify, then ELEVENTY_ENV=production eleventy
yarn format   # prettier --write on src
```

CSS is **not** built by Eleventy. `npx tailwindcss` writes `src/_assets/css/styles.css` straight to `_site/css/styles.css`, outside the Eleventy pipeline. Running `yarn dev` or bare `eleventy` alone produces a site with no stylesheet; use `yarn start` / `yarn build`. `src/_assets/css/style.css` (singular) is in `.eleventyignore` but does not exist — the real entry point is `styles.css`.

## Architecture

### Two kinds of content

1. **Pages** — `src/en/*.md` and `src/de/*.md`. Each declares an explicit `permalink` (`/en/about.html`, `/en/events/index.html`, …) and a `layout`. Almost all their copy lives in front matter fields (`fix_desk_title`, `the_collective`, `contact_cta`, …) which the `.njk` layouts read as bare Nunjucks variables, usually with an inline English fallback (`{{ contact_cta or "Click here for the form" }}`). The markdown body renders as `{{ content | safe }}`.
2. **Collection items** — `src/en/{collective,artists,events}/*.md`. Each folder has a directory data file (`collective.json` etc.) containing `{ "permalink": false }`, so items never become pages. They are pulled into a page by their `tags` value: `collections.collective`, `collections.artist`, `collections.event`, sorted with the custom filters `sortByPosition` / `sortByDateDesc` (`sortByName` exists but is unused and would not work — it subtracts strings). Item bodies render via `item.templateContent`.

Adding a section to a page usually means adding a front-matter field plus the matching field in `src/admin/config.yml`, not adding a template.

### Feature flags

`src/_data/features.js` exposes `features.*` to every template. Currently one flag: `features.room`, off by default, overridable per build with `SHOW_ROOM=true`. It hides the private room offer that has not been agreed with the collective yet — the room section in `desks.njk`, FAQ entries marked `room: true`, and every piece of copy that mentions the room. Room-dependent copy lives in the content files as a `_room` variant next to the normal field (`meta_description` / `meta_description_room`, `availability` / `availability_room`, `contact_text` / `contact_text_room`, and per FAQ item `a` / `a_room`); the template picks the `_room` one only when the flag is on. Two literals in `layout.njk` (the fallback description and the JSON-LD `priceRange`) are switched inline. To retire the flag: drop the `_room` fields into their base fields, remove the `room:` markers, and delete `features.js` with its template conditionals.

### Layouts

`layout.njk` is the shell: `<head>` (SEO, hreflang, JSON-LD LocalBusiness with the real address and price range), header, `<main hx-boost="true">`, footer, cookie banner. Page layouts wrapping it: `desks.njk` (home), `collective.njk`, `artists.njk`, `events.njk`, and `landing.njk` (about — just includes `about.njk` + `what-we-do.njk` + `contact.njk`).

SEO fields on a page: `seo_title` → `<title>`, `meta_description` → description/OG, `image` → OG image, `title` → the visible H1. Pages set `sitemapIgnore: true` to stay out of `sitemap.xml.njk`.

### Images

Two conventions coexist and they are easy to mix up:

- Front matter written by the CMS uses `/src/_assets/images/uploads/foo.jpg` (Decap's `media_folder` is `/src/_assets/images/uploads` with no `public_folder`).
- The `{% image src, alt, width, classes %}` shortcode (`.eleventy.js`) prefixes a leading `.`, so `/src/…` resolves to the on-disk file. It runs eleventy-img, emits WebP at a single width (default 600) into `_site/img/`, and **throws if `alt` is undefined**.
- For raw `src`/`href` in HTML (e.g. the OG tag in `layout.njk`), the served path is `/_assets/…` — `layout.njk` does `image | replace('/src/', '/')` to convert. `src/_assets` is passthrough-copied verbatim.

Vendored browser deps (leaflet, htmx, posthog, universal-cookie, IBM Plex) are passthrough-copied out of `node_modules` in `.eleventy.js` and imported as plain ES modules by `src/_assets/js/index.js`; there is no bundler.

### i18n

`EleventyI18nPlugin` with `defaultLanguage: 'en'`; language comes from the `src/en` / `src/de` directory. `src/_data/eleventyComputed.js` maps `page.lang` to the translated `menu` labels used by `header.njk`. German is partial — only `index.md` and `about.md` exist under `src/de`, and the header's collective/events links are hardcoded to `/en/…` for both languages. Netlify does the language negotiation for `/` (see `netlify.toml`): `Accept-Language: de` → `/de/`, everything else → `/en/`.

### Client behaviour

Navigation is htmx-boosted: nav links carry `hx-get`/`hx-select="main"`/`hx-target="main"`/`hx-push-url`, and `<main>` has `hx-boost`. **Consequence: all page-level JS in `src/_assets/js/index.js` is registered on `htmx:load`, not `DOMContentLoaded`.** Anything new (map init, listeners) must follow that or it will break after the first client-side navigation. PostHog only initialises when the `officina-tracking` cookie is `accepted`, and is disabled on `localhost`.

### CMS and deploy

`/admin` runs Decap CMS via git-gateway on branch **`master`** — content editors commit straight to master, so schema changes in `src/admin/config.yml` must match the front-matter keys the templates read, or the CMS will silently drop fields on save. Netlify builds `npm run build` and publishes `_site/`; `netlify.toml` also holds the 301s for the retired `/en/desks` page (its content moved into `src/en/index.md`).
