import HomePage from "./home/homepage";
import { fetchHomepageShowcaseImages } from "@/lib/publicGallery";

export const dynamic = "force-static";

export default async function Page() {
  const initialShowcaseImages = await fetchHomepageShowcaseImages();
  return <HomePage initialShowcaseImages={initialShowcaseImages} />;
}
