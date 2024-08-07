## `next-static-images-gallery`

An opinionated 'image gallery plugin' for next.js sites

Features:

- Masonry grid 
  - Via `react-masonry-css`
- Infinite scroll
  - Via `react-infinite-scroll-component`
- Lazy-loading of images
- Build-time thumbnail generation
  - Via `sharp`

## Get Started

1. Install library

```
yarn add next-static-images-gallery
```

2. Configure plugin

``` js
// next.config.js
const { withStaticImagesGallery } = require("next-static-images-gallery/src/plugin");

module.exports = withStaticImagesGallery(nextConfig, {
  // the /public directory for the app (so images are available)
  publicRoot: path.join(__dirname, "public"),
  // the "sub path" within /public that contains the images
  inputDir: "gallery",
  // the "sub path" within /public that the thumbnails will be saved to
  outputDir: "gallery/thumbs",
  // the generated thumbnail maximum width
  thumbnailWidth: 400,
});
```

3. Use gallery

``` jsx
/**
 * ⚠️ Run next.js build first to remove the type errors below
 *   generated from next-static-images-gallery/src/plugin
 */
import { ImageGrid } from "next-static-images-gallery";
import images from "../../../public/gallery/thumbs/gallery.json";

export default function Page() {
  return (
    <div>
      <ImageGrid images={images} />
    </div>
  );
}
```
