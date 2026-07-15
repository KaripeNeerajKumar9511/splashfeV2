"use client"

export function openImageViewer(items = [], initialIndex = 0) {
  if (typeof window === "undefined") return

  const normalized = items
    .map((item, idx) => {
      // Support plain string items and mixed API shapes
      if (typeof item === "string") {
        const isRemote = /^https?:\/\//i.test(item)
        return {
          localPath: isRemote ? "" : item,
          url: isRemote ? item : "",
          label: `Image ${idx + 1}`,
        }
      }

      // Prefer generated / explicit paths only — do not fall back to uploaded
      // reference images (those belong to upload UIs, not the generated gallery).
      const localPath =
        item?.localPath ||
        item?.generated_image_path ||
        item?.local_path ||
        item?.local ||
        ""

      let url =
        item?.url ||
        item?.fallbackSrc ||
        item?.generated_image_url ||
        item?.cloud_url ||
        item?.cloud ||
        ""

      // Some history APIs store a local media path in image_url
      const imageUrl = item?.image_url || ""
      if (imageUrl) {
        if (/^https?:\/\//i.test(imageUrl)) {
          if (!url) url = imageUrl
        } else if (!localPath) {
          return {
            localPath: imageUrl,
            url,
            label: item?.label || `Image ${idx + 1}`,
          }
        }
      }

      return {
        localPath,
        url,
        label: item?.label || `Image ${idx + 1}`,
      }
    })
    .filter((item) => Boolean(item.localPath || item.url))

  if (!normalized.length) return

  const clampedIndex = Math.min(
    Math.max(Number(initialIndex) || 0, 0),
    normalized.length - 1
  )

  const key = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const storageKey = `image-viewer:${key}`

  window.sessionStorage.setItem(
    storageKey,
    JSON.stringify({
      images: normalized,
      initialIndex: clampedIndex,
      createdAt: Date.now(),
    })
  )

  window.open(`/dashboard/images/view?key=${encodeURIComponent(key)}`, "_blank")
}
