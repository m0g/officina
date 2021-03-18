const { DateTime } = require('luxon');
const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt, size = 600, classes = "") {
  if(alt === undefined) {
    // You bet we throw an error on missing alt (alt="" works okay)
    throw new Error(`Missing \`alt\` on myImage from: ${src}`);
  }

  let metadata = await Image(src.match(/^\.\//) ? src : `.${src}`, {
    widths: [size],
    formats: ["webp"],
    urlPath: "/img/",
    outputDir: "_site/img",
  });

  let data = metadata.webp[metadata.webp.length - 1];
  
  return `<img 
    src="${data.url}" 
    width="${data.width}" 
    height="${data.height}" 
    alt="${alt}" 
    class="${classes}"
    loading="lazy" 
    decoding="async"
  >`;
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/_assets");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.addFilter(
    'htmlDateString', 
    (dateObj) => DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('dd/LL/yyyy')
  );

  eleventyConfig.addNunjucksFilter("absoluteUrl", href => {
    const base = 'https://officina.berlin';
    let { URL } = require("url");

    return (new URL(href, base)).toString()
  })

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  eleventyConfig.addFilter(
    'sortByPosition', 
    items => items.sort((a, b) => a.data.position - b.data.position)
  );

  return {
    dir: {
      input: "src/",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
}