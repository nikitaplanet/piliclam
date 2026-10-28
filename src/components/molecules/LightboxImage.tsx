'use client';

import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import Image from 'next/image';
import BarLoading from '@/components/atoms/BarLoading';
import SanityImage from '@/components/atoms/SanityImage';
import {usePostGallery} from '@/components/molecules/PostGalleryContext';
import {formatPhotoExif, type ImageMetadataSource} from '@/lib/formatPhotoExif';
import {findGalleryIndex} from '@/lib/postGallery';
import {hasImageAsset, urlFor} from '@/sanity/lib/image';
import type {SanityImageSource} from '@sanity/image-url';

const FADE_MS = 300;
/** 首次開啟至少顯示一輪 UFO 飛行 */
const LOADER_CYCLE_MS = 1500;

type LightboxImageProps = {
	value: SanityImageSource & ImageMetadataSource;
	alt: string;
	width?: number;
	height?: number;
	className?: string;
	priority?: boolean;
	sizes?: string;
	/** 在 PostGallery 內開啟時的索引；未傳則依 asset 自動對應 */
	galleryIndex?: number;
};

export default function LightboxImage({
	value,
	alt,
	width = 2000,
	height = 1000,
	className = '',
	priority = false,
	sizes,
	galleryIndex,
}: LightboxImageProps) {
	const gallery = usePostGallery();
	const [mounted, setMounted] = useState(false);
	const [present, setPresent] = useState(false);
	const [visible, setVisible] = useState(false);
	const [showImage, setShowImage] = useState(false);
	const openedAt = useRef(0);
	const imageReady = useRef(false);
	const revealTimer = useRef<number | null>(null);

	useEffect(() => {
		setMounted(true);
		return () => {
			if (revealTimer.current != null) window.clearTimeout(revealTimer.current);
		};
	}, []);

	useEffect(() => {
		if (!present || gallery) return;

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
	}, [present, gallery]);

	const scheduleReveal = () => {
		if (!imageReady.current) return;
		const wait = Math.max(0, LOADER_CYCLE_MS - (Date.now() - openedAt.current));
		if (revealTimer.current != null) window.clearTimeout(revealTimer.current);
		revealTimer.current = window.setTimeout(() => setShowImage(true), wait);
	};

	const onImageReady = () => {
		imageReady.current = true;
		scheduleReveal();
	};

	const close = () => {
		setVisible(false);
		if (revealTimer.current != null) window.clearTimeout(revealTimer.current);
		window.setTimeout(() => {
			setPresent(false);
			setShowImage(false);
			imageReady.current = false;
		}, FADE_MS);
	};

	const open = () => {
		if (gallery && gallery.images.length > 0) {
			const index = galleryIndex != null && galleryIndex >= 0 ? galleryIndex : findGalleryIndex(gallery.images, value);
			gallery.openAt(index >= 0 ? index : 0);
			return;
		}

		if (revealTimer.current != null) window.clearTimeout(revealTimer.current);
		openedAt.current = Date.now();
		imageReady.current = false;
		setShowImage(false);
		setPresent(true);
		requestAnimationFrame(() => {
			requestAnimationFrame(() => setVisible(true));
		});
	};

	if (!hasImageAsset(value)) return null;

	const lightboxSrc = urlFor(value).width(2400).fit('max').auto('format').quality(95).url();
	const photoExif = formatPhotoExif(value);

	return (
		<>
			<button type="button" aria-label="放大圖片" className={`block w-full cursor-pointer text-left ${className}`} onClick={open}>
				<SanityImage
					value={value}
					alt={alt}
					width={width}
					height={height}
					fit="max"
					priority={priority}
					sizes={sizes}
					className="w-full"
					quality={95}
				/>
			</button>

			{!gallery && mounted && present
				? createPortal(
						<div
							role="dialog"
							aria-modal="true"
							aria-label="圖片預覽"
							className={`fixed inset-0 z-[10000] flex items-center justify-center bg-graphite p-5 text-paper transition-opacity duration-300 ease-out md:p-10 ${
								visible ? 'opacity-100' : 'opacity-0'
							}`}
							onClick={close}>
							<button
								type="button"
								aria-label="close"
								className="absolute top-5 right-5 z-10 cursor-pointer text-2xl lowercase tracking-wide text-paper transition-opacity hover:opacity-70 md:top-8 md:right-10"
								onClick={close}>
								close
							</button>
							{!showImage ? <BarLoading className="absolute inset-0 z-[5]" /> : null}
							<div
								className="relative z-[2] flex max-h-[90dvh] w-full max-w-full flex-col items-center justify-center gap-4 transition-opacity duration-500 ease-out"
								style={{opacity: showImage ? 1 : 0, visibility: showImage ? 'visible' : 'hidden'}}
								aria-hidden={!showImage}
								onClick={(event) => event.stopPropagation()}>
								<span className="relative flex max-h-[min(90dvh,calc(90dvh-3rem))] max-w-full items-center justify-center">
									{/* 背景先載圖，等 loading 一輪後再淡入 */}
									<Image
										src={lightboxSrc}
										alt={alt}
										width={2400}
										height={2400}
										quality={95}
										loading="eager"
										priority
										className="max-h-[min(90dvh,calc(90dvh-3rem))] w-auto max-w-full object-contain"
										onLoad={onImageReady}
										onError={onImageReady}
									/>
								</span>
								{photoExif ? <p className="max-w-[90vw] text-center font-grotesk text-sm text-paper/70">{photoExif}</p> : null}
							</div>
						</div>,
						document.body,
					)
				: null}
		</>
	);
}
