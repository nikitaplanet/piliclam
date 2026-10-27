'use client';

import {Icon as IconifyIcon} from '@iconify/react';

type IconProps = {
	/** Iconify 名稱，例如 lucide:arrow-left、mdi:home */
	icon: string;
	className?: string;
	width?: number | string;
	height?: number | string;
};

/** Iconify 封裝；Next 需 client component */
export default function Icon({icon, className = '', width, height}: IconProps) {
	return <IconifyIcon icon={icon} className={className} width={width} height={height} aria-hidden />;
}
