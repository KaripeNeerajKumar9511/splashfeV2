export function isHttpUrl(src) {
  return /^https?:\/\//i.test(src || "");
}

export function buildMediaUrl(src) {
  if (!src) return "";

  if (isHttpUrl(src)) {
    return src;
  }

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const baseUrl = API_URL.replace(/\/$/, "");

  let cleanPath = src.trim().replace(/\\/g, "/");

  // Strip cache-busting / query strings before path normalization
  const queryIndex = cleanPath.indexOf("?");
  const query = queryIndex !== -1 ? cleanPath.substring(queryIndex) : "";
  if (queryIndex !== -1) {
    cleanPath = cleanPath.substring(0, queryIndex);
  }

  const mediaIndex = cleanPath.toLowerCase().indexOf("/media/");

  if (mediaIndex !== -1) {
    cleanPath = cleanPath.substring(mediaIndex);
  } else {
    cleanPath = cleanPath.replace(/^\/+/, "");

    if (!cleanPath.startsWith("media/")) {
      cleanPath = `media/${cleanPath}`;
    }

    cleanPath = `/${cleanPath}`;
  }

  return `${baseUrl}${cleanPath}${query}`;
}

export const getImageUrl = async (src) => {
  if (!src) return "";

  if (isHttpUrl(src)) {
    return src;
  }

  const url = buildMediaUrl(src);

  try {
    const response = await fetch(url, { method: "HEAD" });
    if (response.ok) {
      return url;
    }

    const getResponse = await fetch(url, { method: "GET" });
    return getResponse.ok ? url : null;
  } catch {
    return null;
  }
};

/**
 * Pick local path (primary) and remote/Cloudinary URL (fallback) from mixed image objects.
 */
export function pickLocalAndCloud(image = {}) {
  if (!image) {
    return { src: "", fallbackSrc: "" };
  }

  // Plain string: treat http as cloud, otherwise as local path
  if (typeof image === "string") {
    if (isHttpUrl(image)) {
      return { src: "", fallbackSrc: image };
    }
    return { src: image, fallbackSrc: "" };
  }

  const localCandidates = [
    image.generated_image_path,
    image.local_path,
    image.local,
    image.uploaded_image_path,
    image.local_url,
  ];

  const cloudCandidates = [
    image.generated_image_url,
    image.cloud_url,
    image.cloud,
    image.uploaded_image_url,
    image.image_url,
    image.url,
  ];

  let src = "";
  for (const candidate of localCandidates) {
    if (candidate && !isHttpUrl(candidate)) {
      src = candidate;
      break;
    }
  }

  let fallbackSrc = "";
  for (const candidate of cloudCandidates) {
    if (!candidate) continue;
    if (isHttpUrl(candidate)) {
      fallbackSrc = candidate;
      break;
    }
    // Some APIs store a local media path in image_url
    if (!src) {
      src = candidate;
    }
  }

  return { src, fallbackSrc };
}

/**
 * Resolve best available URL: local disk first, then Cloudinary/remote.
 */
export async function resolveBestImageUrl(primary, fallback = "") {
  if (primary) {
    if (isHttpUrl(primary)) {
      return primary;
    }
    const localUrl = await getImageUrl(primary);
    if (localUrl) {
      return localUrl;
    }
  }

  if (fallback) {
    if (isHttpUrl(fallback)) {
      return fallback;
    }
    const fallbackUrl = await getImageUrl(fallback);
    if (fallbackUrl) {
      return fallbackUrl;
    }
  }

  if (primary && !isHttpUrl(primary)) {
    return buildMediaUrl(primary);
  }

  return fallback || "";
}

function toCloudinaryAttachmentUrl(url) {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  if (url.includes("fl_attachment")) {
    return url;
  }
  return url.replace("/upload/", "/upload/fl_attachment/");
}

function triggerBlobDownload(blob, filename) {
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  }, 100);
}

/**
 * Download an image preferring local disk, then Cloudinary/remote.
 * Accepts either (src, fallbackSrc, filename) or a single image-like object.
 */
export async function downloadSmartImage(primaryOrImage, fallbackOrFilename, maybeFilename) {
  let src = "";
  let fallbackSrc = "";
  let filename = "image.png";

  if (primaryOrImage && typeof primaryOrImage === "object" && !Array.isArray(primaryOrImage)) {
    // downloadSmartImage({ src, fallbackSrc, filename }) or image object
    if ("src" in primaryOrImage || "fallbackSrc" in primaryOrImage || "filename" in primaryOrImage) {
      src = primaryOrImage.src || "";
      fallbackSrc = primaryOrImage.fallbackSrc || "";
      filename = primaryOrImage.filename || fallbackOrFilename || "image.png";
    } else {
      const picked = pickLocalAndCloud(primaryOrImage);
      src = picked.src;
      fallbackSrc = picked.fallbackSrc;
      filename = fallbackOrFilename || "image.png";
    }
  } else {
    src = primaryOrImage || "";
    if (typeof fallbackOrFilename === "string" && maybeFilename == null && !isHttpUrl(fallbackOrFilename) && fallbackOrFilename.includes(".")) {
      // downloadSmartImage(url, "file.png")
      filename = fallbackOrFilename;
      fallbackSrc = "";
    } else {
      fallbackSrc = fallbackOrFilename || "";
      filename = maybeFilename || "image.png";
    }
  }

  const candidates = [];

  if (src) {
    if (isHttpUrl(src)) {
      candidates.push(src);
    } else {
      const localUrl = await getImageUrl(src);
      candidates.push(localUrl || buildMediaUrl(src));
    }
  }

  if (fallbackSrc) {
    const remote = isHttpUrl(fallbackSrc) ? fallbackSrc : buildMediaUrl(fallbackSrc);
    if (remote && !candidates.includes(remote)) {
      candidates.push(remote);
    }
  }

  let lastError = null;

  for (const url of candidates.filter(Boolean)) {
    try {
      const response = await fetch(url, {
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const blob = await response.blob();
      triggerBlobDownload(blob, filename);
      return true;
    } catch (error) {
      lastError = error;
    }
  }

  // Cloudinary: fl_attachment forces Content-Disposition download
  const cloudCandidate = candidates.find((url) => url?.includes("res.cloudinary.com"));
  if (cloudCandidate) {
    const link = document.createElement("a");
    link.href = toCloudinaryAttachmentUrl(cloudCandidate);
    link.download = filename;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => link.remove(), 100);
    return true;
  }

  // Last resort: open best available URL
  const openUrl = candidates.find(Boolean);
  if (openUrl) {
    window.open(openUrl, "_blank", "noopener,noreferrer");
    return false;
  }

  throw lastError || new Error("Download failed");
}
