const lazyImagesPlugin = require('eleventy-plugin-lazyimages');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/_assets");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.addPlugin(lazyImagesPlugin, {
    imgSelector: 'img.lazy',
    transformImgPath: imagePath => {
      // if (imagePath.match(/src/)) {
      //   return '.' + imagePath
      // }

      // return `./src${imagePath}`;

      const match = imagePath.match(/(_assets.+)/);

      if (!match) {
        return imagePath;
      }

      return `./src/${match[0]}`;
    }
  });

  return {
    dir: {
      input: "src/",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
}