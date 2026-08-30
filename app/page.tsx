"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { FoxyHero } from "@/components/ui/foxy-hero"

export default function Home() {
  const router = useRouter()

  return (
    <FoxyHero
      logo={{
        icon: (
          <img 
            src="/rhythmx-logo.png" 
            alt="RhythmX Logo" 
            className="w-8 h-8 rounded-lg shadow-lg shadow-purple-500/20" 
          />
        ),
        text: "RHYTHMX",
      }}
      navigation={[
        { label: "Home", isActive: true, onClick: () => router.push("/") },
        { label: "Player", onClick: () => router.push("/player") },
        { label: "Privacy Policy", onClick: () => router.push("/privacy") },
        { label: "GitHub", onClick: () => window.open("https://github.com/CodeWithBasu/RhythmX", "_blank") },
      ]}
      headerCta={{
        label: "Launch Player",
        onClick: () => router.push("/player"),
      }}
      title="Smarter Music Visualizer Powered by Advanced Audio Engine"
      subtitle="Where Sonic Reality Meets Visual Precision. Experience zero-latency multi-device sync, atmospheric HSL visualizer gradients, and immersive 8D spatial soundscapes."
      ctaButtons={{
        primary: {
          label: "Open Player",
          onClick: () => router.push("/player"),
        },
        secondary: {
          label: "Download APK >",
          onClick: () => window.open("https://github.com/CodeWithBasu/RhythmX/releases", "_blank"),
        },
      }}
    />
  )
}
