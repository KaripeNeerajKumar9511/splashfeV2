import {
  generateLandingMetadata,
  renderLandingPage,
} from "@/components/landing-pages/landingPageRoute";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params, searchParams }) {
  return generateLandingMetadata("features", params, searchParams);
}

export default async function FeatureLandingPage({ params, searchParams }) {
  return renderLandingPage("features", params, searchParams);
}
