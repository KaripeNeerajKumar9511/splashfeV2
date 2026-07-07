"use client"

export function openImageViewer(items = [], initialIndex = 0) {
  if (typeof window === "undefined") return

  const normalized = items
    .map((item, idx) => ({
      localPath: item?.localPath || item?.generated_image_path || item?.local_path || "",
      url: item?.url || item?.fallbackSrc || item?.generated_image_url || "",
      label: item?.label || `Image ${idx + 1}`,
    }))
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
