import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "../components/providers/SessionProvider";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import SocialSidebar from "@/components/SocialSidebar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Add other weights if needed
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Kudu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} scroll-smooth antialiased`}>
        <Providers>
          <NavBar />
          {children}
          <ScrollToTop />
          <SocialSidebar />
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
