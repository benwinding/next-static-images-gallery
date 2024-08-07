const path = require('path');
const { processImages } = require('./process-thumbnails');

module.exports = { withStaticImagesGallery };

/**
 * @typedef {import('next').NextConfig} NextConfig
 * @typedef {import('webpack').Configuration} WebpackConfig
 */
/** 
 * @typedef {Object} GalleryOptions - Options for the static images gallery.
 * @property {string} publicRoot - The root public directory.
 * @property {string} inputDir - The input directory for images.
 * @property {string} outputDir - The output directory for processed images.
 * @property {number} thumbnailWidth - The width of the thumbnail images.
 */
/**
 * Enhances the Next.js configuration with static images gallery functionality.
 *
 * @param {NextConfig} nextConfig - The existing Next.js configuration.
 * @param {GalleryOptions} galleryOptions - The options for the static images gallery.
 * @returns {NextConfig} - The enhanced Next.js configuration.
 */
function withStaticImagesGallery(nextConfig, galleryOptions) {
  return Object.assign({}, nextConfig, {
    /**
     * Custom webpack configuration.
     *
     * @param {WebpackConfig} config - The existing webpack configuration.
     * @param {any} options - Additional options.
     * @returns {WebpackConfig} - The modified webpack configuration.
     */
    webpack(config, options) {
      if (!options.isServer) {
        console.log({galleryOptions});
        processImages({
          publicRoot: galleryOptions.publicRoot,
          inputDir: galleryOptions.inputDir,
          outputDir: galleryOptions.outputDir,
          thumbnailWidth: galleryOptions.thumbnailWidth,
        }).catch(err => console.error(err));
      }

      // Add custom webpack configurations here
      config.module.rules.push({
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['next/babel'],
          },
        },
      });

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }
      return config;
    },
  });
}
