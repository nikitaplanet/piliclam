'use client';

import {useState} from 'react';
import Image from 'next/image';
import ImageSkeleton from '@/components/atoms/ImageSkeleton';
import {urlFor} from '@/sanity/lib/image';
import type {SanityImageSource} from '@sanity/image-url';

type SanityImageProps = {
	value: SanityImageSource;
	alt: string;
	width: number;
	height: number;
	className?: string;
	imgClassName?: string;
	priority?: boolean;
	sizes?: string;
	fill?: boolean;
	/** CDN fit：max 保留比例不裁切；crop 依寬高裁切 */
	fit?: 'max' | 'crop';
	quality?: number;
};

export default function SanityImage({
	value,
	alt,
	width,
	height,
	className = '',
	imgClassName = '',
	priority = false,
	sizes,
	fill = false,
	fit,
	quality = 90,
}: SanityImageProps) {
	const [loaded, setLoaded] = useState(false);

	if (!value) return null;

	const resolvedFit = fit ?? (fill ? 'crop' : undefined);
	const builder = urlFor(value).width(width).auto('format').quality(quality);
	const src =
		resolvedFit === 'max'
			? builder.fit('max').url()
			: resolvedFit === 'crop'
				? builder.height(height).fit('crop').url()
				: builder.height(height).url();

	return (
		<span className={`print-paper-frame relative block ${className}`}>
			{!loaded ? <ImageSkeleton /> : null}
			<Image
				src={src}
				alt={alt}
				{...(fill ? {fill: true as const, sizes: sizes ?? '100vw'} : {width, height, sizes})}
				priority={priority}
				loading={priority ? 'eager' : 'lazy'}
				quality={quality}
				className={`transition-opacity duration-500 ease-out ${loaded ? 'opacity-100' : 'opacity-0'} ${
					fill ? 'object-cover' : 'h-auto w-full'
				} ${imgClassName}`}
				onLoad={() => setLoaded(true)}
				onError={() => setLoaded(true)}
			/>
		</span>
	);
}
