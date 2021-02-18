const pluginLocalRespimg = require('eleventy-plugin-local-respimg');
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');
const { DateTime } = require('luxon');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/_assets");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.addPlugin(pluginLocalRespimg, {
    folders: {
      source: '.', // Folder images are stored in
      output: '_site', // Folder images should be output to
    },
    images: {
      resize: {
        min: 250, // Minimum width to resize an image to
        max: 1500, // Maximum width to resize an image to
        step: 150, // Width difference between each resized image
      },
      gifToVideo: false, // Convert GIFs to MP4 videos
      sizes: '100vw', // Default image `sizes` attribute
      lazy: true, // Include `loading="lazy"` attribute for images
      // additional: [
      //   'images/icons/**/*',
      // ],
      // watch: {
      //   src: 'images/**/*', // Glob of images that Eleventy should watch for changes to
      // },
      pngquant: {
        /* ... */
      }, // imagemin-pngquant options
      mozjpeg: {
        /* ... */
      }, // imagemin-mozjpeg options
      svgo: {
        /* ... */
      }, // imagemin-svgo options
      gifresize: {
        /* ... */
      }, // @gumlet/gif-resize options
      webp: {
        /* ... */
      }, // imagemin-webp options
      gifwebp: {
        /* ... */
      }, // imagemin-gif2webp options
    },
  });

  // eleventyConfig.addPlugin(lazyImagesPlugin, {
  //   imgSelector: 'img.lazy',
  //   transformImgPath: imagePath => {
  //     const match = imagePath.match(/(_assets.+)/);

  //     if (!match) {
  //       return imagePath;
  //     }

  //     return `./src/${match[0]}`;
  //   }
  // });

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addNunjucksFilter("absoluteUrl", href => {
    const base = 'https://officina.berlin';
    let { URL } = require("url");

    return (new URL(href, base)).toString()
  })

  // eleventyConfig.addFilter('stripSrc', path => {
  //   const match = path.match(/\/src(.+)/);

  //   return match ? match[1] : path;
  // });

  return {
    dir: {
      input: "src/",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
}