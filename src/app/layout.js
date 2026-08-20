import { Geist, Geist_Mono, Cormorant_Garamond, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { CreditsProvider } from "@/context/CreditsContext";
import { AiServerDownProvider } from "@/components/AiServerDownModal";
import { OopsErrorProvider } from "@/components/OopsErrorModal";
import UnregisterServiceWorkers from "@/components/UnregisterServiceWorkers";
import { Toaster } from "react-hot-toast";

const GA_MEASUREMENT_ID = "G-TEFQY2M0RW";
const CLARITY_ID = "x3rckh1nfz";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata = {
  title: "AI Jewelry Photography Generator | Create Luxury Jewelry Photos in Seconds | GoSplash AI",
  description: "Transform jewelry photos into premium studio-quality images with GoSplash AI. Generate luxury product photography, AI model photoshoots, lifestyle images, white background photos, marketing creatives, and social media visuals in seconds without expensive photography.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/images/favicon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${dmSans.variable}`}
    >
      <body className="antialiased">
        <UnregisterServiceWorkers />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {process.env.NODE_ENV === "production" ? (
          <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${CLARITY_ID}");
              `,
            }}
          />
        ) : null}
        <LanguageProvider>
          <AuthProvider>
            <CreditsProvider>
              <AiServerDownProvider>
                <OopsErrorProvider>
                  {children}
                </OopsErrorProvider>
              </AiServerDownProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: "#1e1c19",
                    color: "#f5f2eb",
                    border: "1px solid rgba(205, 150, 57, 0.12)",
                  },
                }}
              />
            </CreditsProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
