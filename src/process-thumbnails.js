const path = require("path");
const fs = require("fs-extra");
const sharp = require("sharp");

module.exports = {
  processImages
}

/**
 * @typedef {Object} JsonImageItem
 * @property {string} urlFull - The path to the full-sized image.
 * @property {string} urlThumb - The path to the thumbnail image.
 * @property {number} width - The width of the image.
 * @property {number} height - The height of the image.
 */

/**
 * @typedef {Object} ProcessImagesOptions
 * @property {string} publicRoot - The root public directory.
 * @property {string} inputDir - The input directory for images.
 * @property {string} outputDir - The output directory for processed images.
 * @property {number} thumbnailWidth - The width of the thumbnail images.
 */

/**
 * @param {ProcessImagesOptions} opts - The options for processing images.
 * @returns {Promise<void>} - A promise that resolves when the processing is complete.
 */
async function processImages(opts) {
  const PUBLIC_DIR = opts.publicRoot;
  const INPUT_DIR = path.join(PUBLIC_DIR, opts.inputDir);
  const OUTPUT_DIR = path.join(PUBLIC_DIR, opts.outputDir);
  const THUMBNAIL_WIDTH = opts.thumbnailWidth;

  console.log("___ processImages begin", { PUBLIC_DIR, INPUT_DIR, OUTPUT_DIR, THUMBNAIL_WIDTH });

  await fs.ensureDir(OUTPUT_DIR);

  const files = await fs.readdir(INPUT_DIR);
  const imageFiles = files.filter(file => /\.(jpe?g|png)$/i.test(file));

  console.log("___ processImages...", { imageFilesCount: imageFiles.length });

  /**
   * @type {Array.<JsonImageItem>}
   */
  const galleryImages = [];
  await Promise.all(imageFiles.map(async filePath => {
    const sourcePath = path.join(INPUT_DIR, filePath);
    const outputPath = path.join(OUTPUT_DIR, filePath);
    const [meta] = await Promise.all([
      getImageMeta(sourcePath),
      generateThumbnail(sourcePath, outputPath, THUMBNAIL_WIDTH),
    ]);
    galleryImages.push({
      width: meta.width,
      height: meta.height,
      urlThumb: removePrefix(outputPath, PUBLIC_DIR),
      urlFull: removePrefix(sourcePath, PUBLIC_DIR),
    });
  }));
  const galleryJsonPath = path.join(OUTPUT_DIR, "gallery.json");
  console.log("___ processImages saving gallery file", { galleryJsonPath });
  await fs.writeFile(galleryJsonPath, JSON.stringify(galleryImages, null, 2));

  console.log("___ processImages complete!");
}

/**
 * Removes the specified prefix from a string if it exists.
 *
 * @param {string} str - The original string.
 * @param {string} prefix - The prefix to remove.
 * @returns {string} - The string without the prefix.
 */
function removePrefix(str, prefix) {
  if (str.startsWith(prefix)) {
    return str.substring(prefix.length);
  }
  return str; // return the original string if the prefix does not match
}

/**
 * Generates a thumbnail for an image.
 *
 * @param {string} sourcePath - The path to the source image.
 * @param {string} outputPath - The path to save the generated thumbnail.
 * @param {number} width - The width of the thumbnail.
 * @returns {Promise<void>} - A promise that resolves when the thumbnail is generated.
 */
async function generateThumbnail(sourcePath, outputPath, width) {
  try {
    await sharp(sourcePath)
      .rotate()
      .resize({ width })
      .toFile(outputPath);
  } catch (error) {
    console.error(`Error generating thumbnail for ${sourcePath}:`, error);
  }
}

/**
 * Retrieves the metadata for an image.
 *
 * @param {string} sourcePath - The path to the source image.
 * @returns {Promise<{ width: number, height: number }>} - A promise that resolves with the image metadata.
 */
async function getImageMeta(sourcePath) {
  try {
    const meta = await sharp(sourcePath).metadata();
    return {
      width: +(meta.width || 0),
      height: +(meta.height || 0),
    };
  } catch (error) {
    console.error(`Error getting details for ${sourcePath}:`, error);
    throw new Error(`Failed to get image metadata for ${sourcePath}`);
  }
}
