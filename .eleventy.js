const { DateTime } = require('luxon');
const { execFileSync } = require('child_process');
const Image = require('@11ty/eleventy-img');
const { EleventyI18nPlugin } = require('@11ty/eleventy');

// Repo-relative path -> date (YYYY-MM-DD) of the last commit touching it.
// One `git log` walk for the whole tree, memoised for the build.
let commitDates;
function gitCommitDates() {
  if (commitDates) return commitDates;

  commitDates = {};
  let log;
  try {
    // core.quotePath=false keeps non-ASCII filenames unescaped and unquoted.
    log = execFileSync(
      'git',
      ['-c', 'core.quotePath=false', 'log', '--name-only', '--format=%cs'],
      {
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'ignore'],
      }
    );
  } catch (error) {
    console.warn(
      `[11ty] no git history, sitemap will omit <lastmod>: ${error.message}`
    );
    return commitDates;
  }

  let date = '';
  for (const line of log.split('\n')) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(line)) date = line;
    // git lists the newest commits first, so the first date a path gets is the
    // one we keep.
    else if (line && date && !commitDates[line]) commitDates[line] = date;
  }

  return commitDates;
}

async function imageShortcode(src, alt, size = 600, classes = '') {
  if (alt === undefined) {
    // You bet we throw an error on missing alt (alt="" works okay)
    throw new Error(`Missing \`alt\` on myImage from: ${src}`);
  }

  let metadata = await Image(src.match(/^\.\//) ? src : `.${src}`, {
    widths: [size],
    formats: ['webp'],
    urlPath: '/img/',
    outputDir: '_site/img',
  });

  let data = metadata.webp[metadata.webp.length - 1];

  return `<img
    src="${data.url}"
    width="${data.width}"
    height="${data.height}"
    alt="${alt}"
    class="${classes}"
    decoding="async"
  >`;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('src/admin');
  eleventyConfig.addPassthroughCopy('src/_assets');
  eleventyConfig.addPassthroughCopy('src/robots.txt');

  eleventyConfig.addPassthroughCopy({
    'src/_assets/js/index.js': 'js/index.js',
    'src/_assets/css/plex.css': 'css/plex.css',
  });

  // Node modules
  eleventyConfig.addPassthroughCopy({
    'node_modules/@ibm/plex/IBM-Plex-Sans/fonts/complete/woff2': 'IBM-Plex-Sans/fonts/complete/woff2',
    'node_modules/leaflet/dist/leaflet.css': 'css/leaflet.css',
    'node_modules/leaflet/dist/leaflet-src.esm.js': 'js/leaflet.js',
    'node_modules/leaflet/dist/images': 'css/images',
    'node_modules/htmx.org/dist/htmx.min.js': 'js/htmx.js',
    'node_modules/posthog-js/dist/module.no-external.js': 'js/posthog.js',
    'node_modules/universal-cookie/esm/index.mjs': 'js/universal-cookie.js',
  });
  eleventyConfig.addFilter('htmlDateString', (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('dd/LL/yyyy')
  );

  // Netlify serves the site on www and 301s the apex to it, so every absolute
  // URL we emit (canonical, hreflang, og:url, sitemap) has to use www too.
  eleventyConfig.addNunjucksFilter('absoluteUrl', (href) => {
    const base = 'https://www.officina.berlin';
    let { URL } = require('url');

    return new URL(href, base).toString();
  });

  // `page.date` is the file's mtime, and Netlify clones the repo fresh on every
  // build, so it would date every page to the last deploy. Use the date of the
  // last commit that touched the source file instead, and emit nothing when git
  // can't tell us (no history in the build, file never committed).
  eleventyConfig.addFilter('lastModified', (inputPath) => {
    const dates = gitCommitDates();
    return dates[inputPath.replace(/^\.\//, '')] || '';
  });

  eleventyConfig.addNunjucksAsyncShortcode('image', imageShortcode);

  // Nunjucks' own `selectattr` ignores the test argument it is given, so pick a
  // single page out of a collection by hand (used by llms.txt).
  eleventyConfig.addFilter('findByInputPath', (pages, inputPath) =>
    (pages || []).find((item) => item.inputPath === inputPath)
  );

  eleventyConfig.addFilter('sortByName', (items) =>
    items.sort((a, b) => a.data.name - b.data.name)
  );

  eleventyConfig.addFilter('sortByPosition', (items) =>
    items.sort((a, b) => a.data.position - b.data.position)
  );

  eleventyConfig.addFilter('sortByDateDesc', (items) =>
    items.sort((a, b) => b.data.date - a.data.date)
  );

  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    defaultLanguage: 'en', // Required
  });

  return {
    dir: {
      input: 'src/',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
  };
};
