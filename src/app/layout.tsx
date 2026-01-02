import type { Metadata } from "next";
import "./globals.css";
//  import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { CustomCursor } from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "LifeVerse - Level Up Your Real Life",
  description: "Transform your daily life into an epic RPG adventure! Complete quests, evolve creatures, build your city, earn XP and coins. Gamification meets productivity - created by Kalpana.",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a78bfa' stroke-width='2'%3E%3Cpath d='M6 2h12v4h2v2h2v12h-2v2h-2v2H6v-2H4v-2H2V8h2V6h2V2z'/%3E%3Cpath d='M10 10h4v4h-4z' fill='%2322d3ee'/%3E%3Cpath d='M8 12h2v2H8z' fill='%234ade80'/%3E%3Cpath d='M14 12h2v2h-2z' fill='%234ade80'/%3E%3C/svg%3E",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="d77b6019-acec-4182-a918-d73030f8c755"
        />
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        {children}
        <Toaster />
        {/* <VisualEditsMessenger /> */}
      </body>
    </html>
  );
}