import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[length:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-green-500 hover:text-green-400 transition-colors mb-12 group">
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to RhythmX
        </Link>

        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40">
            PRIVACY <span className="text-green-500">POLICY</span>
          </h1>
          <p className="text-white/40 font-mono uppercase tracking-[0.2em] text-sm">Last Updated: May 14, 2026</p>
        </header>

        <section className="space-y-12 text-white/70 leading-relaxed text-lg">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-green-500" />
              Introduction
            </h2>
            <p>
              Welcome to RhythmX. Your privacy is critically important to us. This policy explains how we collect, use, and protect your information when you use our music visualization and party synchronization platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-green-500" />
              Information Collection
            </h2>
            <p className="mb-4">We collect minimal information to provide a seamless audio experience:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><span className="text-white font-medium">Audio Files:</span> When you upload songs, they are stored securely on Cloudinary.</li>
              <li><span className="text-white font-medium">Party Data:</span> Temporary room IDs and synchronization states are managed via Pusher to enable real-time listening.</li>
              <li><span className="text-white font-medium">Metadata:</span> Song titles and durations are stored in our MongoDB database to populate your library.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-green-500" />
              Third-Party Services
            </h2>
            <p className="mb-4">RhythmX integrates with high-quality third-party providers:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h3 className="font-bold text-white mb-2">Cloudinary</h3>
                <p className="text-sm">Used for high-capacity audio storage and streaming.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h3 className="font-bold text-white mb-2">Pusher</h3>
                <p className="text-sm">Enables the real-time "Party Sync" websocket technology.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h3 className="font-bold text-white mb-2">LRCLIB</h3>
                <p className="text-sm">Fetches public music lyrics to enhance your visualization.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h3 className="font-bold text-white mb-2">MongoDB</h3>
                <p className="text-sm">Secure database for your library management.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-green-500" />
              Data Security
            </h2>
            <p>
              We implement industry-standard encryption and security protocols to protect your data. We do not sell your personal information to third parties. Your uploaded music is yours, and we only process it to provide the visualization services you request.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-green-500" />
              Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact the RhythmX team via our official repository or support channels.
            </p>
          </div>
        </section>

        <footer className="mt-24 pt-8 border-t border-white/10 text-center text-white/20 text-sm font-mono uppercase tracking-widest">
          &copy; 2026 RhythmX Visualizer // All Rights Reserved
        </footer>
      </div>
    </div>
  );
}
