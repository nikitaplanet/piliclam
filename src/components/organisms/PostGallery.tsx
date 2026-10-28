'use client';

import {useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode} from 'react';
import {createPortal} from 'react-dom';
import Image from 'next/image';
import BarLoading from '@/components/atoms/BarLoading';
import {PostGalleryContext} from '@/components/molecules/PostGalleryContext';
import {formatPhotoExif} from '@/lib/formatPhotoExif';
import type {GalleryImage} from '@/lib/postGallery';
import {hasImageAsset, urlFor} from '@/sanity/lib/image';

const FADE_MS = 300;
const SLIDE_FADE_MS = 360;
/** 首次開啟 lightbox 至少顯示一輪 UFO 飛行 */
const LOADER_CYCLE_MS = 1500;
const LOADER_SLIDE_MS = 160;
const SWIPE_THRESHOLD_PX = 48;

type PostGalleryProps = {
	images: GalleryImage[];
	children: ReactNode;
};

function gallerySrc(image: GalleryImage) {
	if (!hasImageAsset(image.value)) return '';
	return urlFor(image.value).width(2400).fit('max').auto('format').quality(95).url();
}

export default function PostGallery({images, children}: PostGalleryProps) {
	const [mounted, setMounted] = useState(false);
	const [present, setPresent] = useState(false);
	const [visible, setVisible] = useState(false);
	const [index, setIndex] = useState(0);
	const [imageLoaded, setImageLoaded] = useState(false);
	const [slideVisible, setSlideVisible] = useState(false);
	/** 僅首次開啟顯示長條 loading；左右切換不顯示 */
	const [showBarLoader, setShowBarLoader] = useState(false);
	const pointerStart = useRef<{x: number; y: number; id: number} | null>(null);
	const indexRef = useRef(index);
	const transitioning = useRef(false);
	const slideTimer = useRef<number | null>(null);
	const openedAt = useRef(0);
	const revealTimer = useRef<number | null>(null);
	const imageReady = useRef(false);
	/** 本次開啟是否要播滿一輪長條 loading */
	const useFullLoader = useRef(true);

	useEffect(() => {
		setMounted(true);
		return () => {
			if (slideTimer.current != null) window.clearTimeout(slideTimer.current);
			if (revealTimer.current != null) window.clearTimeout(revealTimer.current);
		};
	}, []);

	useEffect(() => {
		indexRef.current = index;
	}, [index]);

	const close = useCallback(() => {
		setVisible(false);
		setSlideVisible(false);
		if (revealTimer.current != null) window.clearTimeout(revealTimer.current);
		window.setTimeout(() => {
			setPresent(false);
			setImageLoaded(false);
			setShowBarLoader(false);
			imageReady.current = false;
			transitioning.current = false;
		}, FADE_MS);
	}, []);

	const scheduleReveal = useCallback(() => {
		if (!imageReady.current) return;
		const minMs = useFullLoader.current ? LOADER_CYCLE_MS : LOADER_SLIDE_MS;
		const wait = Math.max(0, minMs - (Date.now() - openedAt.current));
		if (revealTimer.current != null) window.clearTimeout(revealTimer.current);
		revealTimer.current = window.setTimeout(() => {
			useFullLoader.current = false;
			setShowBarLoader(false);
			setImageLoaded(true);
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setSlideVisible(true);
					transitioning.current = false;
				});
			});
		}, wait);
	}, []);

	const onImageReady = useCallback(() => {
		imageReady.current = true;
		scheduleReveal();
	}, [scheduleReveal]);

	const openAt = useCallback(
		(nextIndex: number) => {
			if (images.length === 0) return;
			if (slideTimer.current != null) window.clearTimeout(slideTimer.current);
			if (revealTimer.current != null) window.clearTimeout(revealTimer.current);
			transitioning.current = false;
			useFullLoader.current = true;
			openedAt.current = Date.now();
			imageReady.current = false;
			setIndex(Math.max(0, Math.min(nextIndex, images.length - 1)));
			setImageLoaded(false);
			setShowBarLoader(true);
			setSlideVisible(false);
			setPresent(true);
			requestAnimationFrame(() => {
				requestAnimationFrame(() => setVisible(true));
			});
		},
		[images.length],
	);

	const goTo = useCallback(
		(nextIndex: number) => {
			if (images.length <= 1 || transitioning.current) return;
			const wrapped = ((nextIndex % images.length) + images.length) % images.length;
			if (wrapped === indexRef.current) return;

			transitioning.current = true;
			setSlideVisible(false);
			setShowBarLoader(false);

			if (slideTimer.current != null) window.clearTimeout(slideTimer.current);
			if (revealTimer.current != null) window.clearTimeout(revealTimer.current);
			slideTimer.current = window.setTimeout(() => {
				useFullLoader.current = false;
				openedAt.current = Date.now();
				imageReady.current = false;
				setImageLoaded(false);
				setIndex(wrapped);
			}, SLIDE_FADE_MS);
		},
		[images.length],
	);

	const goRelative = useCallback(
		(delta: number) => {
			goTo(indexRef.current + delta);
		},
		[goTo],
	);

	useEffect(() => {
		if (!present) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') close();
			if (event.key === 'ArrowLeft') goRelative(-1);
			if (event.key === 'ArrowRight') goRelative(1);
		};

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		document.addEventListener('keydown', onKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener('keydown', onKeyDown);
		};
	}, [present, close, goRelative]);

	const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
		if (event.button !== 0) return;
		pointerStart.current = {x: event.clientX, y: event.clientY, id: event.pointerId};
	};

	const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
		const start = pointerStart.current;
		pointerStart.current = null;
		if (!start || start.id !== event.pointerId || images.length <= 1) return;

		const dx = event.clientX - start.x;
		const dy = event.clientY - start.y;
		if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
		if (Math.abs(dx) < Math.abs(dy)) return;

		event.preventDefault();
		event.stopPropagation();
		goRelative(dx < 0 ? 1 : -1);
	};

	const onPointerCancel = () => {
		pointerStart.current = null;
	};

	const current = images[index];
	const lightboxSrc = current ? gallerySrc(current) : '';
	const photoExif = current ? formatPhotoExif(current.value) : null;
	const showNav = images.length > 1;
	const preloadIndexes = showNav
		? [...new Set([(((index - 1) % images.length) + images.length) % images.length, (index + 1) % images.length])].filter(
				(preloadIndex) => preloadIndex !== index,
			)
		: [];

	return (
		<PostGalleryContext.Provider value={{images, openAt}}>
			{children}

			{mounted && present && current
				? createPortal(
						<div
							role="dialog"
							aria-modal="true"
							aria-label="圖片預覽"
							className={`fixed inset-0 z-[10000] flex touch-pan-y items-center justify-center bg-graphite p-5 pb-16 text-paper transition-opacity duration-300 ease-out md:p-10 md:pb-20 ${
								visible ? 'opacity-100' : 'opacity-0'
							}`}
							onClick={close}
							onPointerDown={onPointerDown}
							onPointerUp={onPointerUp}
							onPointerCancel={onPointerCancel}>
							<button
								type="button"
								aria-label="close"
								className="absolute top-5 right-5 z-10 cursor-pointer touch-manipulation text-2xl lowercase tracking-wide text-paper transition-opacity hover:opacity-70 md:top-8 md:right-10"
								onClick={close}
								onPointerDown={(event) => event.stopPropagation()}>
								close
							</button>

							{showNav ? (
								<button
									type="button"
									aria-label="上一張"
									className="absolute top-1/2 left-0 z-10 hidden h-40 w-20 -translate-y-1/2 cursor-pointer touch-manipulation items-center justify-center text-3xl text-paper transition-opacity hover:opacity-70 md:left-4 md:flex"
									onClick={(event) => {
										event.stopPropagation();
										goRelative(-1);
									}}
									onPointerDown={(event) => event.stopPropagation()}>
									‹
								</button>
							) : null}

							{showNav ? (
								<button
									type="button"
									aria-label="下一張"
									className="absolute top-1/2 right-0 z-10 hidden h-40 w-20 -translate-y-1/2 cursor-pointer touch-manipulation items-center justify-center text-3xl text-paper transition-opacity hover:opacity-70 md:right-4 md:flex"
									onClick={(event) => {
										event.stopPropagation();
										goRelative(1);
									}}
									onPointerDown={(event) => event.stopPropagation()}>
									›
								</button>
							) : null}

							{showBarLoader ? <BarLoading className="absolute inset-0 z-[5]" /> : null}
							<div
								className="relative z-[2] flex max-h-[90dvh] w-full max-w-full touch-pan-y flex-col items-center gap-4 select-none"
								aria-hidden={!imageLoaded}
								onClick={(event) => event.stopPropagation()}>
								<div
									className="flex max-h-[min(90dvh,calc(90dvh-5rem))] w-full max-w-full flex-col items-center gap-4 transition-opacity ease-out"
									style={{
										opacity: slideVisible ? 1 : 0,
										transitionDuration: `${SLIDE_FADE_MS}ms`,
										visibility: slideVisible || imageLoaded ? 'visible' : 'hidden',
									}}>
									<span className="relative flex max-h-[min(90dvh,calc(90dvh-5rem))] max-w-full items-center justify-center">
										{/* 背景先載圖，首次開啟等飛碟播完一輪再淡入 */}
										<Image
											key={lightboxSrc}
											src={lightboxSrc}
											alt={current.alt}
											width={2400}
											height={2400}
											quality={95}
											priority
											draggable={false}
											className="max-h-[min(90dvh,calc(90dvh-5rem))] w-auto max-w-full object-contain"
											onLoad={onImageReady}
											onError={onImageReady}
										/>
									</span>
									{current.caption ? (
										<p className="max-w-[90vw] text-center font-grotesk text-sm text-paper/80">{current.caption}</p>
									) : null}
									{photoExif ? <p className="max-w-[90vw] text-center font-grotesk text-sm text-paper/70">{photoExif}</p> : null}
								</div>
							</div>

							{showNav ? (
								<p
									className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 font-grotesk text-sm tracking-wide text-paper/70 transition-opacity ease-out md:bottom-8"
									style={{
										opacity: slideVisible ? 1 : 0,
										transitionDuration: `${SLIDE_FADE_MS}ms`,
									}}>
									{index + 1}/{images.length}
								</p>
							) : null}

							{preloadIndexes.map((preloadIndex) => {
								const image = images[preloadIndex];
								if (!image) return null;
								return (
									<Image
										key={`preload-${preloadIndex}`}
										src={gallerySrc(image)}
										alt=""
										width={2400}
										height={2400}
										quality={95}
										className="pointer-events-none absolute h-0 w-0 opacity-0"
										aria-hidden
									/>
								);
							})}
						</div>,
						document.body,
					)
				: null}
		</PostGalleryContext.Provider>
	);
}
