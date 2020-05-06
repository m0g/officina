const lazyImagesPlugin = require('eleventy-plugin-lazyimages');
const { DateTime } = require('luxon');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/_assets");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.addPlugin(lazyImagesPlugin, {
    imgSelector: 'img.lazy',
    transformImgPath: imagePath => {
      const match = imagePath.match(/(_assets.+)/);

      if (!match) {
        return imagePath;
      }

      return `./src/${match[0]}`;
    }
  });

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addNunjucksFilter("absoluteUrl", href => {
    const base = 'https://officina.berlin';
    let { URL } = require("url");

    return (new URL(href, base)).toString()
  })

  return {
    dir: {
      input: "src/",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
}