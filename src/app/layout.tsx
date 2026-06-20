import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar          from "@/components/ui/Navbar";
import GlobalBackground from "@/components/ui/GlobalBackground";
import SmoothScrollProvider from "@/components/ui/SmoothScrollProvider";
import CustomCursor    from "@/components/ui/CustomCursor";
import CursorTrail     from "@/components/ui/CursorTrail";
import SideNav         from "@/components/ui/SideNav";
import IntroScreen     from "@/components/ui/IntroScreen";
import AskManju        from "@/components/ui/AskManju";
import NYClock         from "@/components/ui/NYClock";
import HireMeTrigger   from "@/components/ui/HireMeTrigger";
import RobotGreeting   from "@/components/ui/RobotGreeting";
import CLITerminal     from "@/components/ui/CLITerminal";
import AmbientAudio    from "@/components/ui/AmbientAudio";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Manjunath Popuri - AI/ML Engineer · Stripe",
  description:
    "Building multi-agent LangGraph orchestration systems processing 70M+ daily transactions at Stripe. MS CS (AI Specialization) · Binghamton University.",
  keywords: [
    "AI Engineer",
    "ML Engineer",
    "Machine Learning",
    "LangGraph",
    "Multi-Agent AI",
    "RAG",
    "LLM Fine-tuning",
    "Stripe",
    "Binghamton University",
  ],
  openGraph: {
    title: "Manjunath Popuri - AI/ML Engineer at Stripe",
    description:
      "Building multi-agent AI that processes 70M+ daily transactions. Sub-150ms p95 latency. 99.9% SLA.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        <IntroScreen />
        <CursorTrail />
        <CustomCursor />
        <GlobalBackground />
        <Navbar />
        <SideNav />
        <AmbientAudio />
        <CLITerminal />
        <NYClock />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <AskManju />
        <HireMeTrigger />
        <RobotGreeting />
      </body>
    </html>
  );
}
