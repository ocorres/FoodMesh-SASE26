import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FoodMesh",
  description: "A hyperlocal food resilience network that connects surplus food with nearby people and community organizations."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
