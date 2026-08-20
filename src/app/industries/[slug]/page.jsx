import {
  generateLandingMetadata,
  renderLandingPage,
} from "@/components/landing-pages/landingPageRoute";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params, searchParams }) {
  return generateLandingMetadata("industries", params, searchParams);
}

export default async function IndustryLandingPage({ params, searchParams }) {
  return renderLandingPage("industries", params, searchParams);
}
