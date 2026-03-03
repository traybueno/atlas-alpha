import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Epstein Atlas — Interactive Location Map from Public Records",
  description:
    "An interactive geographic map of every confirmed Jeffrey Epstein location extracted from public government archives. Every pin links to the source document. Built with Corners Engine.",
  openGraph: {
    title: "The Epstein Atlas",
    description:
      "Interactive map of confirmed Jeffrey Epstein locations from public government records. Every data point is sourced, scored, and verifiable.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
