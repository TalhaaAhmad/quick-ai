import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ConvexProviderWrapper from "../components/ConvexProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "QuickAI - AI-Powered Customer Engagement",
  description: "QuickAI helps your business engage customers, automate sales, and grow effortlessly with friendly, human-like conversations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <ConvexProviderWrapper>
          {children}
        </ConvexProviderWrapper>
      </body>
    </html>
  );
}
