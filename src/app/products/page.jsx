import LandingPageIndex from "@/components/landing-pages/LandingPageIndex";
import { fetchLandingPages } from "@/lib/landingPages";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products | Splash AI Studio",
  description: "AI product photography pages from Splash AI Studio.",
};

export default async function ProductsIndexPage() {
  const pages = await fetchLandingPages("products");
  return <LandingPageIndex typePath="products" pages={pages} />;
}
