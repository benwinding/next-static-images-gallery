import classNames from "classnames";
import { useState } from "react";
import styles from "./image-card.module.scss";

/**
 * @typedef {Object} ImageCardProps
 * @property {string} urlFull - The full URL of the image.
 * @property {string} urlThumb - The thumbnail URL of the image.
 * @property {number} width - The width of the image.
 * @property {number} height - The height of the image.
 */
/**
 * @param {ImageCardProps} props - The properties for the ImageCard component.
 */
export function ImageCard(props) {
  const [state, setState] = useState("loading");
  return (
    <div className={styles.imageCard}>
      <a
        href={props.urlFull}
        target="_blank"
        rel="noreferrer"
        data-pswp-width={props.width}
        data-pswp-height={props.height}
      >
        <img
          src={props.urlThumb}
          onLoad={() => setState("loaded")}
          onError={() => setState("error")}
          alt=""
          className={classNames(styles.img, {
            [styles.h0]: state !== "loaded",
          })}
          loading="lazy"
        />
        {state === "loading"
          ? <LoadingPlaceholder width={props.width} height={props.height} />
          : null}
        {
          state === 'error'
            ? <ErrorPlaceholder width={props.width} height={props.height} />
            : null}
      </a>
    </div>
  );
}

/**
 * @typedef {Object} LoadingPlaceholderProps
 * @property {number} width - The width of the image.
 * @property {number} height - The height of the image.
 */
/**
 * @param {LoadingPlaceholderProps} props - The properties for the LoadingPlaceholder component.
 */
function LoadingPlaceholder(props) {
  return (
    <div
      style={{ aspectRatio: props.width / props.height }}
      className={styles.loadingPlaceholder}
    >
    </div>
  );
}

/**
 * @typedef {Object} ErrorPlaceholderProps
 * @property {number} width - The width of the image.
 * @property {number} height - The height of the image.
 */
/**
 * @param {ErrorPlaceholderProps} props - The properties for the ErrorPlaceholder component.
 */
function ErrorPlaceholder(props) {
  return (
    <div
      style={{ aspectRatio: props.width / props.height }}
      className={styles.errorPlaceholder}
    >
      {"Image failed to load :("}
    </div>
  );
}
