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
}: SanityImageProps) {
	const [loaded, setLoaded] = useState(false);

	if (!value) return null;

	const src = fill ? urlFor(value).width(width).height(height).fit('crop').url() : urlFor(value).width(width).height(height).url();

	return (
		<span className={`relative block overflow-hidden ${className}`}>
			{!loaded ? <ImageSkeleton /> : null}
			<Image
				src={src}
				alt={alt}
				{...(fill ? {fill: true as const, sizes: sizes ?? '100vw'} : {width, height, sizes})}
				priority={priority}
				loading={priority ? 'eager' : 'lazy'}
				className={`transition-opacity duration-500 ease-out ${
					loaded ? 'opacity-100' : 'opacity-0'
				} ${fill ? 'object-cover' : 'h-auto w-full'} ${imgClassName}`}
				onLoad={() => setLoaded(true)}
				onError={() => setLoaded(true)}
			/>
		</span>
	);
}
