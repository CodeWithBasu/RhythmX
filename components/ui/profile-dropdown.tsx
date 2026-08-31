"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Settings, CreditCard, FileText, LogOut, User } from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

interface MenuItem {
    label: string;
    value?: string;
    href: string;
    icon: React.ReactNode;
    external?: boolean;
    onClick?: () => void;
}

interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
    showTopbar?: boolean;
}

export function ProfileDropdown({
    className,
    ...props
}: ProfileDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const { user, logout } = useAuth();

    if (!user) {
        return null; // Don't show if not logged in
    }

    const menuItems: MenuItem[] = [
        {
            label: "Settings",
            href: "#",
            icon: <Settings className="w-4 h-4" />,
        },
        {
            label: "Terms & Policies",
            href: "#",
            icon: <FileText className="w-4 h-4" />,
            external: true,
        },
    ];

    const avatarUrl = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=random`;

    return (
        <div className={cn("relative z-50", className)} {...props}>
            <DropdownMenu onOpenChange={setIsOpen}>
                <div className="group relative">
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex items-center gap-4 p-1.5 sm:p-2 pr-2 sm:pr-3 rounded-full sm:rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 focus:outline-none"
                        >
                            <div className="relative">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-black">
                                        {/* Using standard img to avoid Next.js domain config issues for Google profile pics */}
                                        <img
                                            src={avatarUrl}
                                            alt={user.displayName || "Profile"}
                                            width={32}
                                            height={32}
                                            className="w-full h-full object-cover rounded-full"
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="text-left hidden md:block">
                                <div className="text-[11px] sm:text-xs font-medium text-white tracking-tight leading-tight max-w-[100px] truncate">
                                    {user.displayName || "User"}
                                </div>
                            </div>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        className="w-56 p-2 bg-[#0C0414]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl shadow-black/50 z-50"
                    >
                        <div className="px-2 py-1.5 mb-2 border-b border-white/10">
                            <div className="text-sm font-medium text-white tracking-tight leading-tight truncate">
                                {user.displayName}
                            </div>
                            <div className="text-xs text-white/50 tracking-tight leading-tight truncate mt-0.5">
                                {user.email}
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <DropdownMenuItem key={item.label} asChild>
                                    <Link
                                        href={item.href}
                                        target={item.external ? "_blank" : undefined}
                                        className="flex items-center p-2 hover:bg-white/10 rounded-xl transition-all duration-200 cursor-pointer group border border-transparent"
                                    >
                                        <div className="flex items-center gap-2 flex-1">
                                            {React.cloneElement(item.icon as React.ReactElement, { className: "w-4 h-4 text-white/70 group-hover:text-white" })}
                                            <span className="text-xs font-medium text-white/80 tracking-tight leading-tight whitespace-nowrap group-hover:text-white transition-colors">
                                                {item.label}
                                            </span>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </div>

                        <DropdownMenuSeparator className="my-2 bg-white/10" />

                        <DropdownMenuItem asChild>
                            <button
                                type="button"
                                onClick={() => logout()}
                                className="w-full flex items-center gap-2 p-2 duration-200 bg-red-500/10 rounded-xl hover:bg-red-500/20 cursor-pointer border border-transparent hover:border-red-500/30 transition-all group"
                            >
                                <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-400" />
                                <span className="text-xs font-medium text-red-500 group-hover:text-red-400">
                                    Sign Out
                                </span>
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </div>
            </DropdownMenu>
        </div>
    );
}
