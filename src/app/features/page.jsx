import LandingPageIndex from "@/components/landing-pages/LandingPageIndex";
import { fetchLandingPages } from "@/lib/landingPages";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Features | Splash AI Studio",
  description: "Explore Splash AI Studio features for jewellery photography.",
};

export default async function FeaturesIndexPage() {
  const pages = await fetchLandingPages("features");
  return <LandingPageIndex typePath="features" pages={pages} />;
}
