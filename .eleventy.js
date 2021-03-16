const pluginLocalRespimg = require('eleventy-plugin-local-respimg');
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');
const { DateTime } = require('luxon');
const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt, size = 600) {
  if(alt === undefined) {
    // You bet we throw an error on missing alt (alt="" works okay)
    throw new Error(`Missing \`alt\` on myImage from: ${src}`);
  }

  let metadata = await Image(src.match(/^\.\//) ? src : `.${src}`, {
    widths: [size],
    formats: ["jpeg"],
    urlPath: "/img/",
    outputDir: "_site/img",
  });

  let data = metadata.jpeg[metadata.jpeg.length - 1];
  
  return `<img 
    src="${data.url}" 
    width="${data.width}" 
    height="${data.height}" 
    alt="${alt}" 
    loading="lazy" 
    decoding="async"
  >`;
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/_assets");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addNunjucksFilter("absoluteUrl", href => {
    const base = 'https://officina.berlin';
    let { URL } = require("url");

    return (new URL(href, base)).toString()
  })

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  return {
    dir: {
      input: "src/",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
}