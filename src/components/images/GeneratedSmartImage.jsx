"use client"

import SmartImage from "@/utils/SmartImage"
import { isHttpUrl } from "@/utils/imagehelper"

/**
 * Resolve primary (local) and fallback URLs from a generated image object.
 * Only uses generated output fields — never uploaded reference/input images.
 */
export function getGeneratedImageSources(image) {
  if (!image) {
    return { src: "", fallbackSrc: "" }
  }

  const primary =
    image.generated_image_path ||
    image.local_path ||
    image.local ||
    ""

  // Prefer a remote generated URL; local paths stored in generated_image_url
  // are handled as primary below when they are not http(s).
  const urlField =
    image.generated_image_url ||
    image.cloud_url ||
    image.cloud ||
    ""

  if (urlField && isHttpUrl(urlField)) {
    const fallbackSrc = image.id ? `${urlField}?v=${image.id}` : urlField

    return {
      src: primary || "",
      fallbackSrc,
    }
  }

  // generated_image_url may itself be a local media path
  const localFromUrl =
    urlField && !isHttpUrl(urlField) ? urlField : ""

  const resolvedPrimary = primary || localFromUrl
  const cacheKey = image.mongo_id || image.id
  const primaryWithCache =
    resolvedPrimary && cacheKey && !isHttpUrl(resolvedPrimary)
      ? `${resolvedPrimary}?v=${cacheKey}`
      : resolvedPrimary

  return {
    src: primaryWithCache || "",
    fallbackSrc: "",
  }
}

/** Build a viewer item with local path + Cloudinary fallback for openImageViewer. */
export function toViewerItem(image, label) {
  const { src, fallbackSrc } = getGeneratedImageSources(image)

  return {
    localPath: src,
    url: fallbackSrc,
    label,
  }
}

export default function GeneratedSmartImage({ image, alt = "Generated image", ...props }) {
  const { src, fallbackSrc } = getGeneratedImageSources(image)

  return (
    <SmartImage
      src={src}
      fallbackSrc={fallbackSrc}
      alt={alt}
      {...props}
    />
  )
}
