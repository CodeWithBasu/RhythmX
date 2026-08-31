"use client";
import React from 'react';
import Link from 'next/link';
import AnimatedForm from '@/components/ui/animated-form';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Github, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignInPage() {
  const { user, signInWithGoogle } = useAuth();`n  const router = useRouter();`n`n  useEffect(() => {`n    if (user) {`n      router.push("/player");`n    }`n  }, [user, router]);
  return (
    <div className="min-h-screen flex flex-col bg-[#0C0414]">
      <Header />
      
      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C084FC]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-[1000px] grid lg:grid-cols-2 gap-12 lg:gap-24 items-center z-10">
          
          {/* Left Column: Sign In Form */}
          <div className="flex flex-col gap-6 p-8 rounded-2xl bg-[#130820]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(192,132,252,0.1)]">
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
              <p className="text-white/60">Enter your credentials to access the Sonic Reality Engine.</p>
            </div>
            
            <form className="flex flex-col gap-4 mt-4" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/80">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#C084FC]/50 focus:border-[#C084FC]/50 transition-all"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white/80">Password</label>
                  <Link href="#" className="text-xs font-medium text-[#C084FC] hover:text-white transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#C084FC]/50 focus:border-[#C084FC]/50 transition-all"
                  />
                </div>
              </div>
              
              <Button className="w-full bg-[#C084FC] hover:bg-[#A855F7] text-white font-semibold mt-4 py-6 rounded-lg transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(192,132,252,0.3)]">
                Sign In <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-white/40 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="bg-transparent border-white/10 text-white hover:bg-white/5 h-12">
                <Github className="w-5 h-5 mr-2" /> GitHub
              </Button>
              <Button type="button" onClick={signInWithGoogle} variant="outline" className="bg-transparent border-white/10 text-white hover:bg-white/5 h-12">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg> Google
              </Button>
            </div>
            
            <p className="text-center text-sm text-white/60 mt-4">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#C084FC] font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Right Column: Animated Form Component */}
          <div className="hidden lg:flex flex-col items-start justify-center p-0 lg:pl-12">
            <div className="mb-12 text-left space-y-4 max-w-md">
              <h2 className="text-4xl font-bold text-white leading-tight">Join the next generation of audio</h2>
              <p className="text-white/60 text-base">Experience your music like never before with our WebGL-powered 3D visualizers and zero-latency syncing.</p>
            </div>
            
            <div className="relative w-full max-w-[400px]">
              {/* Outer decorative glow for the animated form */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#C084FC]/30 to-transparent blur-3xl rounded-full opacity-60" />
              <div className="relative shadow-[0_0_50px_rgba(192,132,252,0.15)] rounded-2xl transform hover:scale-[1.02] transition-transform duration-500 bg-[#0C0414] scale-110 origin-left">
                <AnimatedForm delay={7000} name="Alex Morgan" />
              </div>
            </div>
          </div>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}



