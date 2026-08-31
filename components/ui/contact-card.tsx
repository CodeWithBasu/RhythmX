import React from 'react';
import { cn } from '@/lib/utils';
import { PlusIcon } from 'lucide-react';

type ContactInfoProps = React.ComponentProps<'div'> & {
	icon: React.ElementType;
	label: string;
	value: string;
	iconColor?: string;
};

type ContactCardProps = React.ComponentProps<'div'> & {
	// Content props
	title?: string;
	description?: string;
	contactInfo?: ContactInfoProps[];
	formSectionClassName?: string;
};

export function ContactCard({
	title = 'Contact With Us',
	description = 'If you have any questions regarding our Services or need help, please fill out the form here. We do our best to respond within 1 business day.',
	contactInfo,
	className,
	formSectionClassName,
	children,
	...props
}: ContactCardProps) {
	return (
		<div
			className={cn(
				'bg-white/5 backdrop-blur-md border border-white/10 relative grid h-full w-full shadow-2xl rounded-2xl overflow-hidden md:grid-cols-2 lg:grid-cols-5',
				className,
			)}
			{...props}
		>
			<PlusIcon className="absolute -top-3 -left-3 h-6 w-6 text-white/20" />
			<PlusIcon className="absolute -top-3 -right-3 h-6 w-6 text-white/20" />
			<PlusIcon className="absolute -bottom-3 -left-3 h-6 w-6 text-white/20" />
			<PlusIcon className="absolute -right-3 -bottom-3 h-6 w-6 text-white/20" />
			
            <div className="flex flex-col justify-between lg:col-span-3">
				<div className="relative h-full space-y-4 px-6 py-10 md:p-12">
					<h2 className="text-3xl font-black md:text-4xl lg:text-5xl text-white uppercase tracking-tight" style={{ fontFamily: "'Pixer', monospace" }}>
						{title}
					</h2>
					<p className="text-white/60 max-w-xl text-sm md:text-base lg:text-lg leading-relaxed">
						{description}
					</p>
					<div className="flex flex-col gap-5 pt-8">
						{contactInfo?.map((info, index) => (
							<ContactInfo key={index} {...info} />
						))}
					</div>
				</div>
			</div>
			
            <div
				className={cn(
					'bg-[#130820]/80 flex h-full w-full items-center border-t border-white/10 p-6 sm:p-10 md:col-span-1 lg:col-span-2 md:border-t-0 md:border-l',
					formSectionClassName,
				)}
			>
				{children}
			</div>
		</div>
	);
}

function ContactInfo({
	icon: Icon,
	label,
	value,
	className,
	iconColor,
	...props
}: ContactInfoProps) {
	return (
		<div className={cn('flex items-center gap-4 py-3 group w-full', className)} {...props}>
			<div className={cn('bg-white/5 border border-white/10 rounded-xl p-3 flex-shrink-0 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300', iconColor || 'text-[#C084FC]')}>
				<Icon className="h-6 w-6" strokeWidth={1.5} />
			</div>
			<div className="flex-1 min-w-0">
				<p className="font-semibold text-white">{label}</p>
				<p className="text-white/50 text-sm mt-0.5 truncate">{value}</p>
			</div>
		</div>
	);
}
