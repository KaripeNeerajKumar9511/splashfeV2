import LandingPageIndex from "@/components/landing-pages/LandingPageIndex";
import { fetchLandingPages } from "@/lib/landingPages";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Industries | Splash AI Studio",
  description: "Industry landing pages from Splash AI Studio.",
};

export default async function IndustriesIndexPage() {
  const pages = await fetchLandingPages("industries");
  return <LandingPageIndex typePath="industries" pages={pages} />;
}
