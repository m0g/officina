const lazyImagesPlugin = require('eleventy-plugin-lazyimages');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/_assets");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // if (process.env.ELEVENTY_ENV === 'production') {
    eleventyConfig.addPlugin(lazyImagesPlugin, {
      transformImgPath: src => {
        return `./src${src}`;
      }
    });
  // }

  return {
    dir: {
      input: "src/",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
}