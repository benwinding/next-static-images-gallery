"use client";
import Masonry from "react-masonry-css";

import { ImageCard } from "./image-card";
import styles from "./image-grid.module.scss";

/**
 * @typedef {Object} ImageGalleryItem
 * @property {string} urlFull - The full URL of the image.
 * @property {string} urlThumb - The thumbnail URL of the image.
 * @property {number} width - The width of the image.
 * @property {number} height - The height of the image.
 */

/**
 * @typedef {Object} ImageGallery
 * @property {ImageGalleryItem[]} images - An array of image gallery items.
 */

const BREAKPOINTS = {
  350: 1,
  700: 2,
  1050: 3,
  1400: 4,
  1750: 5,
  2100: 6,
};
const DEFAULT_BREAKPOINT = 7;

function getChunkSize() {
  if (global.window == null) {
    return 12;
  }
  const windowWidth = global.window.innerWidth;
  for (const [key, val] of Object.entries(BREAKPOINTS)) {
    const breakPointWidth = Number(key);
    const breakPointVal = Number(val) * 4;
    if (breakPointWidth > windowWidth) {
      return breakPointVal;
    }
  }
  return DEFAULT_BREAKPOINT * 4;
}

const chunkSize = getChunkSize();

/**
 * @param {{ 
 *   images: ImageGalleryItem[],
 *   endMessage?: React.ReactNode,
 * }} props - The properties for the ImageGrid component.
 */
export function ImageGrid(props) {
  /** 
   * @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]} 
   */
  const [imagesLoadedUrls, setImagesLoadedUrls] = useState([]);
  const hasMore = props.images.length > imagesLoadedUrls.length;

  useEffect(() => {
    console.log(`loading first "${chunkSize}", out of ${props.images.length} images`);
    setImagesLoadedUrls(props.images.slice(0, chunkSize).map(img => img.urlFull));
    init();
  }, [props.images]);

  const loadNext = () => {
    const lastIndex = imagesLoadedUrls.length - 1;
    console.log(`loading next "${chunkSize}" images from: ${lastIndex}`);
    setImagesLoadedUrls(props.images.slice(0, lastIndex + chunkSize).map(img => img.urlFull));
  };

  return (
    <div>
      <MyInfiniteScroll
        dataLength={imagesLoadedUrls.length}
        endMessage={props.endMessage}
        loadNext={loadNext}
        hasMore={hasMore}
      >
        <MyMasonryLayout
          imageUrlsLoaded={imagesLoadedUrls}
          images={props.images}
        />
      </MyInfiniteScroll>
    </div>
  );
}

// INFINITE SCROLL

import InfiniteScroll from "react-infinite-scroll-component";

/**
 * @typedef {Object} MyInfiniteScrollProps
 * @property {React.ReactNode} children - The children elements to render inside the infinite scroll component.
 * @property {React.ReactNode} endMessage - The message shown when the entire gallery has been shown.
 * @property {number} dataLength - The current length of the data.
 * @property {boolean} hasMore - Indicates if there are more items to load.
 * @property {() => any} loadNext - The function to call to load the next set of items.
 */

/**
 * @param {MyInfiniteScrollProps} props - The properties for the MyInfiniteScroll component.
 */
function MyInfiniteScroll(props) {
  return (
    <InfiniteScroll
      dataLength={props.dataLength}
      next={props.loadNext}
      hasMore={props.hasMore}
      loader={<h4>Loading images...</h4>}
      endMessage={props.endMessage || <p className={styles.endMessage}>All images loaded :)</p>}
    >
      {props.children}
    </InfiniteScroll>
  );
}

// MASONARY LAYOUT

/**
 * @typedef {Object} MyMasonryLayoutProps
 * @property {ImageGalleryItem[]} images - An array of image gallery items.
 * @property {string[]} imageUrlsLoaded - An array of image URLs that have been loaded.
 */

/**
 * @param {MyMasonryLayoutProps} props - The properties for the MyMasonryLayout component.
 */
function MyMasonryLayout(props) {
  return (
    <Masonry
      breakpointCols={{ ...BREAKPOINTS, default: DEFAULT_BREAKPOINT }}
      className={styles["my-masonry-grid"]}
      columnClassName={styles["my-masonry-grid_column"]}
    >
      {props.images.map((image, index) => (
        <div key={image.urlFull} hidden={!props.imageUrlsLoaded.includes(image.urlFull)}>
          <ImageCard
            urlFull={image.urlFull}
            urlThumb={image.urlThumb}
            width={image.width}
            height={image.height}
          />
        </div>
      ))}
    </Masonry>
  );
}

// LIGHTBOX

import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import { useState, useEffect } from "react";

const lightbox = new PhotoSwipeLightbox({
  gallery: "." + styles["my-masonry-grid"],
  children: "a",

  zoom: true,
  initialZoomLevel: "fit",
  secondaryZoomLevel: 1,
  maxZoomLevel: 2,

  pswpModule: () => import("photoswipe"),
});

function init() {
  lightbox.init();
}
