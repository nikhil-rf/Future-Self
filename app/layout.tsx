import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "FutureSelf – Your Context-Aware Reminder System",
  description:
    "Write notes to your future self. Get personalized AI-powered reminders when it matters most.",
  keywords: ["reminders", "AI", "productivity", "future self", "notes"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen" style={{ background: "#0a0a0f" }}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#111118",
                color: "#e2e8f0",
                border: "1px solid #1e1e2e",
                borderRadius: "12px",
                fontSize: "14px",
              },
              success: {
                iconTheme: { primary: "#10b981", secondary: "#0a0a0f" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#0a0a0f" },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
