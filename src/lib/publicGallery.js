import fs from "fs";
import path from "path";

const GALLERY_DIR = path.join(process.cwd(), "public", "galery");
const IMAGE_EXTENSIONS = new Set([".webp", ".png", ".jpg", ".jpeg", ".gif"]);

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
  other: "Jewelry visual",
};

export function getPublicGalleryImages() {
  if (!fs.existsSync(GALLERY_DIR)) return [];

  return fs
    .readdirSync(GALLERY_DIR)
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .map((file) => {
      const category = inferCategory(file);
      return {
        src: `/galery/${encodeURIComponent(file)}`,
        filename: file,
        category,
        label: CATEGORY_LABELS[category] || CATEGORY_LABELS.other,
      };
    })
    .sort((a, b) => b.filename.localeCompare(a.filename));
}
