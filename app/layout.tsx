import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'RhythmX — Perfect Zero-Latency Music Sync & Visualizer',
  description: 'Experience stunning real-time neon visualizers and perfect multi-device synchronization. Host a party, listen together, and interact with live social reactions. The ultimate way to share your music!',
  generator: 'Next.js',
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    url: 'https://rhythm-x.vercel.app',
    title: 'RhythmX — Synchronized Music Visualizer Party',
    description: 'Zero-latency multi-device audio alignment with interactive social reactions and high-velocity neon visuals.',
    siteName: 'RhythmX',
    images: [{
      url: '/hero-banner.png',
      width: 1200,
      height: 630,
      alt: 'RhythmX Music Visualizer Preview',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RhythmX — Feel the Beat Together',
    description: 'Listen to music in perfect sync with friends across any device.',
    images: ['/hero-banner.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RhythmX',
  },
  icons: {
    icon: '/icon-512x512.png',
    apple: '/icon-512x512.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
}

import Background from '@/components/background'
import Providers from '@/components/providers'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <body className="font-sans antialiased text-white">
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WZCBC7DNZ3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WZCBC7DNZ3');
          `}
        </Script>
        <Providers>
          <Background />
          {children}
        </Providers>
      </body>
    </html>
  )
}
