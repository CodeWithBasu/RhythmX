'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { LucideIcon, Menu, X, PlayCircle, Smartphone, AudioWaveform, Wifi, Github, FileText, MessageSquare, Shield, HelpCircle, ChevronRight, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

type LinkItem = {
	title: string;
	href: string;
	icon: LucideIcon;
	description?: string;
};

export function Header() {
	const { user, logout } = useAuth();
	const [open, setOpen] = useState(false);
	const scrolled = useScroll(10);

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<header
			className={cn('fixed top-0 left-0 right-0 z-50 w-full border-b border-transparent transition-all duration-300', {
				'bg-[#0C0414]/80 backdrop-blur-md border-white/10 shadow-lg': scrolled,
				'bg-transparent': !scrolled
			})}
		>
			<nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
				<div className="flex items-center gap-8">
					<Link href="/" className="flex flex-col justify-center transition-transform hover:scale-105">
						<div className="flex items-center text-2xl tracking-tight uppercase text-white leading-none mb-1" style={{ fontFamily: "'Pixer', monospace" }}>
							RHYTHM<span className="text-[#C084FC] ml-[1px] relative">
								X
								<span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#C084FC]"></span>
							</span>
						</div>
					</Link>
					
					<NavigationMenu className="hidden md:flex">
						<NavigationMenuList className="gap-2">
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent text-white/80 hover:text-white hover:bg-white/5 data-[state=open]:bg-white/10 transition-colors">Platform</NavigationMenuTrigger>
								<NavigationMenuContent>
									<div className="flex flex-col bg-[#0C0414]/95 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_-10px_rgba(192,132,252,0.3)] w-[400px] rounded-xl overflow-hidden">
										<ul className="grid gap-2 p-4">
											{productLinks.map((item, i) => (
												<li key={i}>
													<ListItem {...item} />
												</li>
											))}
										</ul>
										<div className="p-4 bg-gradient-to-r from-[#C084FC]/10 to-transparent border-t border-white/5 group/cta cursor-pointer transition-colors hover:from-[#C084FC]/20">
											<Link href="/player" className="flex items-center justify-between">
												<div className="flex flex-col">
													<span className="text-white font-medium text-sm">Ready to experience the engine?</span>
													<span className="text-[#C084FC] text-xs font-semibold mt-0.5">Launch Player</span>
												</div>
												<div className="w-8 h-8 rounded-full bg-[#C084FC]/20 flex items-center justify-center group-hover/cta:bg-[#C084FC] transition-colors">
													<ChevronRight className="w-4 h-4 text-[#C084FC] group-hover/cta:text-white transition-colors" />
												</div>
											</Link>
										</div>
									</div>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent text-white/80 hover:text-white hover:bg-white/5 data-[state=open]:bg-white/10 transition-colors">Resources</NavigationMenuTrigger>
								<NavigationMenuContent>
									<div className="grid w-[500px] grid-cols-2 bg-[#0C0414]/95 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_-10px_rgba(192,132,252,0.3)] rounded-xl overflow-hidden">
										<ul className="p-4 space-y-2">
											{companyLinks.map((item, i) => (
												<li key={i}>
													<ListItem {...item} />
												</li>
											))}
										</ul>
										<ul className="p-4 space-y-1 bg-white/[0.02] border-l border-white/5">
											{companyLinks2.map((item, i) => (
												<li key={i}>
													<NavigationMenuLink asChild className="flex p-3 hover:bg-[#C084FC]/10 text-white/70 hover:text-white rounded-lg items-center gap-3 transition-colors group cursor-pointer">
														<Link href={item.href}>
															<item.icon className="size-4 text-white/50 group-hover:text-[#C084FC] transition-colors" />
															<span className="font-medium text-sm">{item.title}</span>
														</Link>
													</NavigationMenuLink>
												</li>
											))}
										</ul>
									</div>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink asChild className="bg-transparent px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-md transition-colors cursor-pointer">
									<Link href="https://github.com/CodeWithBasu/RhythmX">GitHub</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>

				<div className="hidden items-center gap-2 md:flex">
					{user ? (
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2 text-sm text-white/80">
								{user.photoURL ? (
									<img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full border border-white/10" />
								) : (
									<div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><User className="w-4 h-4" /></div>
								)}
								<span className="hidden lg:block">{user.displayName || user.email}</span>
							</div>
							<Button variant="ghost" size="icon" onClick={logout} className="text-white/60 hover:text-white hover:bg-white/10" title="Log Out">
								<LogOut className="w-4 h-4" />
							</Button>
						</div>
					) : (
						<>
							<Link href="/signin" className="relative group px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
								<span>Sign In</span>
								<span className="absolute bottom-1 left-4 right-4 h-[2px] bg-[#C084FC] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300 rounded-full"></span>
							</Link>
							
							<Link href="/signup" className="relative inline-flex h-9 overflow-hidden rounded-full p-[1px] focus:outline-none hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(192,132,252,0.2)] hover:shadow-[0_0_25px_rgba(192,132,252,0.4)]">
								<span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0C0414_0%,#C084FC_50%,#0C0414_100%)]" />
								<span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#130820] px-5 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-colors hover:bg-white/5">
									Sign Up
								</span>
							</Link>
						</>
					)}
					
					<div className="w-px h-5 bg-white/10 mx-2"></div>

					<Button className="bg-[#C084FC] hover:bg-[#A855F7] text-white font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(192,132,252,0.4)]" asChild>
						<Link href="/player">Launch Player</Link>
					</Button>
				</div>
				
				<Button
					size="icon"
					variant="ghost"
					onClick={() => setOpen(!open)}
					className="md:hidden text-white hover:bg-white/10"
					aria-expanded={open}
					aria-controls="mobile-menu"
					aria-label="Toggle menu"
				>
					{open ? <X className="size-6" /> : <Menu className="size-6" />}
				</Button>
			</nav>

			<MobileMenu open={open} className="flex flex-col justify-between gap-6 overflow-y-auto bg-[#0C0414] border-t border-white/10 pt-6 px-4 pb-10">
				<div className="flex w-full flex-col gap-y-4">
					<span className="text-xs font-bold text-white/40 uppercase tracking-widest pl-2">Platform</span>
					{productLinks.map((link) => (
						<ListItem key={link.title} {...link} />
					))}
					<div className="h-px bg-white/10 my-2" />
					<span className="text-xs font-bold text-white/40 uppercase tracking-widest pl-2">Resources</span>
					{companyLinks.map((link) => (
						<ListItem key={link.title} {...link} />
					))}
					{companyLinks2.map((link) => (
						<ListItem key={link.title} {...link} />
					))}
				</div>
				<div className="flex flex-col gap-3 mt-8">
					{user ? (
						<Button variant="outline" onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300">
							<LogOut className="w-4 h-4 mr-2" /> Log Out
						</Button>
					) : (
						<div className="grid grid-cols-2 gap-3">
							<Button variant="outline" className="w-full border-white/20 bg-transparent text-white hover:bg-white/5" onClick={() => setMobileMenuOpen(false)} asChild>
								<Link href="/signin">Sign In</Link>
							</Button>
							<Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="relative inline-flex h-10 w-full overflow-hidden rounded-md p-[1px] focus:outline-none hover:scale-[1.02] transition-transform duration-300">
								<span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0C0414_0%,#C084FC_50%,#0C0414_100%)]" />
								<span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-[#130820] px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-colors hover:bg-[#1A0B2E]">
									Sign Up
								</span>
							</Link>
						</div>
					)}
					<Button className="w-full bg-[#C084FC] hover:bg-[#A855F7] text-white mt-1 shadow-[0_0_15px_rgba(192,132,252,0.4)]" asChild>
						<Link href="/player">Launch Player</Link>
					</Button>
				</div>
			</MobileMenu>
		</header>
	);
}

type MobileMenuProps = React.ComponentProps<'div'> & {
	open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
	if (!open || typeof window === 'undefined') return null;

	return createPortal(
		<div
			id="mobile-menu"
			className={cn(
				'fixed top-16 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden md:hidden animate-in fade-in slide-in-from-top-2 duration-300',
			)}
		>
			<div className={cn('size-full', className)} {...props}>
				{children}
			</div>
		</div>,
		document.body,
	);
}

function ListItem({
	title,
	description,
	icon: Icon,
	className,
	href,
	...props
}: React.ComponentProps<typeof NavigationMenuLink> & LinkItem) {
	return (
		<NavigationMenuLink className={cn('w-full flex flex-row gap-4 hover:bg-[#C084FC]/10 rounded-lg p-3 transition-colors group cursor-pointer', className)} {...props} asChild>
			<Link href={href}>
				<div className="bg-white/5 border border-white/10 flex aspect-square size-12 items-center justify-center rounded-xl shadow-sm group-hover:bg-[#C084FC] group-hover:border-[#C084FC] group-hover:shadow-[0_0_15px_rgba(192,132,252,0.4)] transition-all duration-300">
					<Icon className="text-white/70 group-hover:text-white size-5 transition-colors" />
				</div>
				<div className="flex flex-col items-start justify-center flex-1">
					<span className="font-semibold text-white/90 group-hover:text-white transition-colors">{title}</span>
					{description && <span className="text-white/40 text-xs mt-1 line-clamp-1">{description}</span>}
				</div>
			</Link>
		</NavigationMenuLink>
	);
}

const productLinks: LinkItem[] = [
	{
		title: 'Web Player',
		href: '/player',
		description: 'Launch the browser visualizer',
		icon: PlayCircle,
	},
	{
		title: 'Android App',
		href: 'https://github.com/CodeWithBasu/RhythmX/releases',
		description: 'Download the native APK',
		icon: Smartphone,
	},
	{
		title: 'Sonic Engine',
		href: '/player',
		description: '8D Audio & Equalizer',
		icon: AudioWaveform,
	},
	{
		title: 'Party Mode',
		href: '/player',
		description: 'Sync across multiple devices',
		icon: Wifi,
	},
];

const companyLinks: LinkItem[] = [
	{
		title: 'Source Code',
		href: 'https://github.com/CodeWithBasu/RhythmX',
		description: 'View the open-source repository',
		icon: Github,
	},
	{
		title: 'Documentation',
		href: '#',
		description: 'Learn how to self-host RhythmX',
		icon: FileText,
	},
];

const companyLinks2: LinkItem[] = [
	{
		title: 'Discord Community',
		href: '#',
		icon: MessageSquare,
	},
	{
		title: 'Privacy Policy',
		href: '/privacy',
		icon: Shield,
	},
	{
		title: 'Help Center',
		href: '#',
		icon: HelpCircle,
	},
];

function useScroll(threshold: number) {
	const [scrolled, setScrolled] = React.useState(false);

	const onScroll = React.useCallback(() => {
		setScrolled(window.scrollY > threshold);
	}, [threshold]);

	React.useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, [onScroll]);

	React.useEffect(() => {
		onScroll();
	}, [onScroll]);

	return scrolled;
}

