'use client';

import {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import Image from 'next/image';
import ImageSkeleton from '@/components/atoms/ImageSkeleton';
import SanityImage from '@/components/atoms/SanityImage';
import {formatPhotoExif, type ImageMetadataSource} from '@/lib/formatPhotoExif';
import {urlFor} from '@/sanity/lib/image';
import type {SanityImageSource} from '@sanity/image-url';

const FADE_MS = 300;

type LightboxImageProps = {
	value: SanityImageSource & ImageMetadataSource;
	alt: string;
	width?: number;
	height?: number;
	className?: string;
	priority?: boolean;
	sizes?: string;
};

export default function LightboxImage({value, alt, width = 2000, height = 1000, className = '', priority = false, sizes}: LightboxImageProps) {
	const [mounted, setMounted] = useState(false);
	const [present, setPresent] = useState(false);
	const [visible, setVisible] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!present) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') close();
		};

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		document.addEventListener('keydown', onKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener('keydown', onKeyDown);
		};
	}, [present]);

	const open = () => {
		setImageLoaded(false);
		setPresent(true);
		requestAnimationFrame(() => {
			requestAnimationFrame(() => setVisible(true));
		});
	};

	const close = () => {
		setVisible(false);
		window.setTimeout(() => {
			setPresent(false);
			setImageLoaded(false);
		}, FADE_MS);
	};

	if (!value) return null;

	const lightboxSrc = urlFor(value).width(2400).fit('max').auto('format').quality(90).url();
	const photoExif = formatPhotoExif(value);

	return (
		<>
			<button type="button" aria-label="放大圖片" className={`block w-full cursor-pointer text-left ${className}`} onClick={open}>
				<SanityImage value={value} alt={alt} width={width} height={height} fit="max" priority={priority} sizes={sizes} className="w-full" />
			</button>

			{mounted && present
				? createPortal(
						<div
							role="dialog"
							aria-modal="true"
							aria-label="圖片預覽"
							className={`fixed inset-0 z-[100] flex items-center justify-center bg-white p-5 transition-opacity duration-300 ease-out md:p-10 ${
								visible ? 'opacity-100' : 'opacity-0'
							}`}
							onClick={close}>
							<button
								type="button"
								aria-label="close"
								className="absolute top-5 right-5 cursor-pointer text-2xl lowercase tracking-wide text-foreground transition-colors hover:text-primary md:top-8 md:right-10"
								onClick={close}>
								close
							</button>
							<div className="flex max-h-[90dvh] max-w-full flex-col items-center gap-4" onClick={(event) => event.stopPropagation()}>
								<span className="relative flex max-h-[min(90dvh,calc(90dvh-3rem))] max-w-full items-center justify-center">
									{!imageLoaded ? (
										<span className="relative block h-[50vh] w-[min(90vw,800px)] overflow-hidden">
											<ImageSkeleton />
										</span>
									) : null}
									<Image
										src={lightboxSrc}
										alt={alt}
										width={2400}
										height={2400}
										quality={90}
										loading="lazy"
										className={`max-h-[min(90dvh,calc(90dvh-3rem))] w-auto max-w-full object-contain transition-opacity duration-500 ease-out ${
											imageLoaded ? 'opacity-100' : 'absolute opacity-0'
										}`}
										onLoad={() => setImageLoaded(true)}
										onError={() => setImageLoaded(true)}
									/>
								</span>
								{photoExif ? <p className="max-w-[90vw] text-center text-sm text-gray-500">{photoExif}</p> : null}
							</div>
						</div>,
						document.body,
					)
				: null}
		</>
	);
}
