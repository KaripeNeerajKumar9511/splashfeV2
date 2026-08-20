import {
  generateLandingMetadata,
  renderLandingPage,
} from "@/components/landing-pages/landingPageRoute";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params, searchParams }) {
  return generateLandingMetadata("products", params, searchParams);
}

export default async function ProductLandingPage({ params, searchParams }) {
  return renderLandingPage("products", params, searchParams);
}
