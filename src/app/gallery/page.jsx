import { fetchPublicGalleryImages } from "@/lib/publicGallery";
import PublicGallery from "@/components/gallery/PublicGallery";

export const metadata = {
  title: "Gallery | Splash AI Studio",
  description:
    "Browse AI-generated jewelry visuals created with Splash — campaign shots, product photography, and background changes.",
};

export default async function GalleryPage() {
  const images = await fetchPublicGalleryImages();
  return <PublicGallery images={images} />;
}
