import fs from "fs";
import path from "path";

const GALLERY_DIR = path.join(process.cwd(), "public", "galery");
const IMAGE_EXTENSIONS = new Set([".webp", ".png", ".jpg", ".jpeg", ".gif"]);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function inferCategory(filename) {
  const lower = filename.toLowerCase();
  if (lower.startsWith("background_change")) return "background";
  if (lower.startsWith("campaign_shot")) return "campaign";
  if (lower.startsWith("image-plain")) return "product";
  return "other";
}

const CATEGORY_LABELS = {
  background: "Background change",
  campaign: "Campaign visual",
  product: "Product shot",
  lifestyle: "Lifestyle",
  model: "Model shot",
  multi_piece: "Multi piece",
  other: "Jewelry visual",
};

export function normalizePublicGalleryImage(img) {
  if (!img) return null;
  const category = img.category || img.image_type || "other";
  const rawSrc = img.src || img.image_url;
  let src = rawSrc;
  if (rawSrc && String(rawSrc).startsWith("/media/")) {
    src = `${API_BASE_URL.replace(/\/$/, "")}${rawSrc}`;
  }
  return {
    id: img.id || rawSrc,
    src,
    category: category === "background_change" ? "background" : category,
    label: img.label || CATEGORY_LABELS[category] || CATEGORY_LABELS.other,
    alt: img.alt || img.alt_text || img.label || "Jewelry visual",
    homepage_layout: img.homepage_layout,
    image_type: img.image_type || category,
    aspect_ratio: img.aspect_ratio || "",
    visibility: img.visibility || "",
  };
}

function getPublicGalleryImagesFromFilesystem() {
  if (!fs.existsSync(GALLERY_DIR)) return [];

  return fs
    .readdirSync(GALLERY_DIR)
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .map((file) => {
      const category = inferCategory(file);
      return normalizePublicGalleryImage({
        src: `/galery/${encodeURIComponent(file)}`,
        category,
        label: CATEGORY_LABELS[category] || CATEGORY_LABELS.other,
        alt: CATEGORY_LABELS[category] || CATEGORY_LABELS.other,
      });
    })
    .sort((a, b) => b.src.localeCompare(a.src));
}

export async function fetchPublicGalleryImages() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/homepage/public-gallery/`, {
      next: { revalidate: 60 },
    });
    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.images) && data.images.length > 0) {
        return data.images.map(normalizePublicGalleryImage).filter(Boolean);
      }
    }
  } catch (error) {
    console.warn("Failed to fetch public gallery from API:", error);
  }
  return getPublicGalleryImagesFromFilesystem();
}

const SHOWCASE_RATIO_ORDER = [
  "1:1",
  "4:5",
  "5:4",
  "3:4",
  "4:3",
  "2:3",
  "3:2",
  "9:16",
  "16:9",
  "21:9",
];

export async function fetchHomepageShowcaseImages() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/homepage/public-gallery/showcase/`, {
      cache: "force-cache",
    });
    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.images) && data.images.length > 0) {
        return data.images
          .map(normalizePublicGalleryImage)
          .filter(Boolean)
          .sort((a, b) => {
            const ai = SHOWCASE_RATIO_ORDER.indexOf(a.aspect_ratio);
            const bi = SHOWCASE_RATIO_ORDER.indexOf(b.aspect_ratio);
            return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
          });
      }
    }
  } catch (error) {
    console.warn("Failed to fetch homepage showcase from API:", error);
  }
  return [];
}

/** @deprecated Use fetchPublicGalleryImages */
export function getPublicGalleryImages() {
  return getPublicGalleryImagesFromFilesystem();
}
