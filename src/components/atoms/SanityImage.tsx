'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import ImageSkeleton from '@/components/atoms/ImageSkeleton';
import {hasImageAsset, urlFor} from '@/sanity/lib/image';
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
	const valid = hasImageAsset(value);
	const resolvedFit = fit ?? (fill ? 'crop' : undefined);
	const src = valid
		? (() => {
				const builder = urlFor(value).width(width).auto('format').quality(quality);
				return resolvedFit === 'max'
					? builder.fit('max').url()
					: resolvedFit === 'crop'
						? builder.height(height).fit('crop').url()
						: builder.height(height).url();
			})()
		: '';

	const [loaded, setLoaded] = useState(false);
	const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);

	useEffect(() => {
		setLoaded(false);
	}, [src]);

	// 快取圖掛載時 complete 已是 true，直接顯示避免換頁後再閃
	useEffect(() => {
		if (imgEl?.complete && imgEl.naturalWidth > 0) setLoaded(true);
	}, [imgEl, src]);

	if (!valid || !src) return null;

	return (
		<span className={`relative block ${className}`}>
			{!loaded ? <ImageSkeleton /> : null}
			<Image
				ref={setImgEl}
				src={src}
				alt={alt}
				{...(fill ? {fill: true as const, sizes: sizes ?? '100vw'} : {width, height, sizes})}
				priority={priority}
				loading={priority ? 'eager' : 'lazy'}
				quality={quality}
				className={`relative ${fill ? 'object-cover' : 'h-auto w-full'} ${imgClassName}`}
				onLoad={() => setLoaded(true)}
				onError={() => setLoaded(true)}
			/>
		</span>
	);
}
