"use client";

import React from "react";
import { FaqSection } from "@/components/ui/faq-scroller";
import { Footer } from "@/components/ui/footer";
import { ContactSection } from "@/components/ui/contact-section";
import { Header } from "@/components/ui/header";
import { FoxyHero } from "@/components/ui/foxy-hero";
import { Zap, Cpu, Fingerprint, Pencil, Settings2, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { FeatureCard } from '@/components/ui/grid-feature-cards';
import { HeroParallax } from '@/components/ui/hero-parallax';

// Features adapted for RhythmX
const features = [
	{
		title: 'Zero-Latency Sync',
		icon: Zap,
		description: 'Party mode supports an entire room of devices, syncing audio perfectly with WebSockets.',
	},
	{
		title: 'Hardware Optimized',
		icon: Cpu,
		description: 'Our WebGL audio visualizer runs smoothly on any device without draining your battery.',
	},
	{
		title: 'Secure & Private',
		icon: Fingerprint,
		description: 'No tracking, no accounts needed. Your local audio files never leave your device.',
	},
	{
		title: 'Customizable Themes',
		icon: Pencil,
		description: 'Switch between Neon Pulse, Cyber Matrix, and Deep Ocean visualizer themes.',
	},
	{
		title: 'Advanced Audio Engine',
		icon: Settings2,
		description: '8D spatial audio and precise equalizer controls give you complete power over your sound.',
	},
	{
		title: 'Dynamic Lyrics',
		icon: Sparkles,
		description: 'Sing along with real-time LRC-synced lyrics integrated flawlessly above your tracks.',
	},
];


const products = [
  {
    title: "Dynamic Visualizer",
    link: "/player",
    thumbnail: "/showcase/img1.png",
  },
  {
    title: "Cross-Device Sync",
    link: "/player",
    thumbnail: "/showcase/img2.png",
  },
  {
    title: "Responsive Player UI",
    link: "/player",
    thumbnail: "/showcase/img3.png",
  },
  {
    title: "Spatial 8D Audio",
    link: "/player",
    thumbnail: "/showcase/img4.png",
  },
  {
    title: "Custom Theming",
    link: "/player",
    thumbnail: "/showcase/img5.png",
  },
  {
    title: "Real-time Lyrics",
    link: "/player",
    thumbnail: "/showcase/img6.png",
  },
  {
    title: "Party Mode",
    link: "/player",
    thumbnail: "/showcase/img7.png",
  },
  {
    title: "Fluid Animations",
    link: "/player",
    thumbnail: "/showcase/img8.png",
  },
  {
    title: "Seamless Playback",
    link: "/player",
    thumbnail: "/showcase/img9.png",
  },
  {
    title: "Album Art Focus",
    link: "/player",
    thumbnail: "/showcase/img10.png",
  },
  {
    title: "Dark Mode Native",
    link: "/player",
    thumbnail: "/showcase/img11.png",
  },
  {
    title: "Interactive Controls",
    link: "/player",
    thumbnail: "/showcase/img12.png",
  },
  {
    title: "High Fidelity",
    link: "/player",
    thumbnail: "/showcase/img13.png",
  },
  {
    title: "Zero Latency",
    link: "/player",
    thumbnail: "/showcase/img14.png",
  },
  {
    title: "Next.js Powered",
    link: "/player",
    thumbnail: "/showcase/img15.png",
  },
];

type ViewAnimationProps = {
	delay?: number;
	className?: React.ComponentProps<typeof motion.div>['className'];
	children: React.ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
}


const faqData = {
    mainTitle: "FREQUENTLY ASKED QUESTIONS",
    mainSubtitle:
      "Everything you need to know about the RhythmX Sonic Reality Engine.",
    rows: [
      {
        id: 'row1',
        speed: '60s',
        direction: 'left',
        faqItems: [
          {
            id: 'q1',
            question: 'What is RhythmX?',
            answer:
              'RhythmX is a next-generation Sonic Reality Engine and music player that features real-time WebGL visualizers, 8D spatial audio, and zero-latency syncing.'
          },
          {
            id: 'q2',
            question: 'Is it completely free?',
            answer:
              'Yes! The web application and the Android app are completely free to use with no hidden subscriptions or paywalls.'
          }
        ]
      },
      {
        id: 'row2',
        speed: '45s',
        direction: 'right',
        faqItems: [
          {
            id: 'q3',
            question: 'Can I upload my own music?',
            answer:
              'Absolutely. You can play local MP3 files directly from your device, or upload them to our cloud database to access them anywhere.'
          },
          {
            id: 'q4',
            question: 'How does Party Mode work?',
            answer:
              'Party Mode uses websockets to sync audio playback perfectly across multiple devices in the same room, creating a seamless surround sound experience.'
          }
        ]
      },
      {
        id: 'row3',
        speed: '70s',
        direction: 'left',
        faqItems: [
          {
            id: 'q5',
            question: 'Does it work offline?',
            answer:
              'Yes! The Android app allows you to play your locally downloaded MP3 files without needing an active internet connection.'
          },
          {
            id: 'q6',
            question: 'Are my files private?',
            answer:
              '100%. We do not track your listening habits, and local files played through the app never leave your device unless you explicitly upload them.'
          }
        ]
      }
    ]
  };

export default function Home() {
  return (
    <div style={{ background: "#0C0414" }}>
      <Header />
      <FoxyHero
        logo={{
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#A855F7]">
              <path
                d="M12 2L4 7V12C4 16.97 7.84 21.5 12 22C16.16 21.5 20 16.97 20 12V7L12 2Z"
                fill="currentColor"
              />
            </svg>
          ),
          text: (
            <div className="flex flex-col justify-center ml-1">
              <div className="flex items-center text-3xl tracking-tight uppercase text-white leading-none mb-1" style={{ fontFamily: "'Pixer', monospace" }}>
                RHYTHM<span className="text-[#C084FC] ml-[1px] relative">
                  X
                  <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#C084FC]"></span>
                </span>
              </div>
              <div className="text-[#888888] text-[10px] tracking-[0.2em]" style={{ fontFamily: "'Pixer', monospace" }}>
                SONIC REALITY ENGINE
              </div>
            </div>
          ),
        }}
        navigation={[]}
        headerCta={undefined}
        title="Smarter Music Visualizer Powered by Advanced Audio Engine"
        subtitle="Where Sonic Reality Meets Visual Precision. Experience zero-latency multi-device sync, atmospheric HSL visualizer gradients, and immersive 8D spatial soundscapes."
        ctaButtons={{
          primary: {
            label: "Open Player",
            onClick: () => window.location.href = "/player",
          },
          secondary: {
            label: "Download APK >",
            onClick: () => window.open("https://github.com/CodeWithBasu/RhythmX/releases", "_blank"),
          },
        }}
      />
      
      {/* Features Section */}
      <section className="py-16 md:py-32 relative z-10" style={{ background: "#0C0414" }}>
        <div className="mx-auto w-full max-w-5xl space-y-8 px-4">
            <AnimatedContainer className="mx-auto max-w-3xl text-center">
                <h2 className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl xl:font-extrabold text-white">
                    Power. Speed. Control.
                </h2>
                <p className="mt-4 text-sm tracking-wide text-balance md:text-base text-white/60">
                    Everything you need to experience immersive audio directly in your browser or phone.
                </p>
            </AnimatedContainer>

            <AnimatedContainer
                delay={0.4}
                className="grid grid-cols-1 divide-x divide-y divide-dashed divide-white/20 border border-dashed border-white/20 sm:grid-cols-2 md:grid-cols-3"
            >
                {features.map((feature, i) => (
                    <FeatureCard key={i} feature={feature} />
                ))}
            </AnimatedContainer>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#0C0414] py-10 relative z-10">
        <FaqSection data={faqData} />
      </section>

      {/* App Showcase Parallax */}
      <HeroParallax products={products} />
      <ContactSection />
      <Footer />
    </div>
  );
}


