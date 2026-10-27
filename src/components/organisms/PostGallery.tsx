'use client';

import {useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode} from 'react';
import {createPortal} from 'react-dom';
import Image from 'next/image';
import ImageSkeleton from '@/components/atoms/ImageSkeleton';
import {PostGalleryContext} from '@/components/molecules/PostGalleryContext';
import {formatPhotoExif} from '@/lib/formatPhotoExif';
import type {GalleryImage} from '@/lib/postGallery';
import {urlFor} from '@/sanity/lib/image';

const FADE_MS = 300;
const SLIDE_FADE_MS = 360;
const SWIPE_THRESHOLD_PX = 48;

type PostGalleryProps = {
	images: GalleryImage[];
	children: ReactNode;
};

function gallerySrc(image: GalleryImage) {
	return urlFor(image.value).width(2400).fit('max').auto('format').quality(95).url();
}

export default function PostGallery({images, children}: PostGalleryProps) {
	const [mounted, setMounted] = useState(false);
	const [present, setPresent] = useState(false);
	const [visible, setVisible] = useState(false);
	const [index, setIndex] = useState(0);
	const [imageLoaded, setImageLoaded] = useState(false);
	const [slideVisible, setSlideVisible] = useState(false);
	const pointerStart = useRef<{x: number; y: number; id: number} | null>(null);
	const indexRef = useRef(index);
	const transitioning = useRef(false);
	const slideTimer = useRef<number | null>(null);

	useEffect(() => {
		setMounted(true);
		return () => {
			if (slideTimer.current != null) window.clearTimeout(slideTimer.current);
		};
	}, []);

	useEffect(() => {
		indexRef.current = index;
	}, [index]);

	const close = useCallback(() => {
		setVisible(false);
		setSlideVisible(false);
		window.setTimeout(() => {
			setPresent(false);
			setImageLoaded(false);
			transitioning.current = false;
		}, FADE_MS);
	}, []);

	const openAt = useCallback(
		(nextIndex: number) => {
			if (images.length === 0) return;
			if (slideTimer.current != null) window.clearTimeout(slideTimer.current);
			transitioning.current = false;
			setIndex(Math.max(0, Math.min(nextIndex, images.length - 1)));
			setImageLoaded(false);
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

			if (slideTimer.current != null) window.clearTimeout(slideTimer.current);
			slideTimer.current = window.setTimeout(() => {
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

	const revealSlide = useCallback(() => {
		setImageLoaded(true);
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				setSlideVisible(true);
				transitioning.current = false;
			});
		});
	}, []);

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
									className="absolute top-1/2 left-1 z-10 hidden min-h-12 min-w-12 -translate-y-1/2 cursor-pointer touch-manipulation px-2 text-3xl text-paper transition-opacity hover:opacity-70 md:left-8 md:flex md:items-center md:justify-center"
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
									className="absolute top-1/2 right-1 z-10 hidden min-h-12 min-w-12 -translate-y-1/2 cursor-pointer touch-manipulation px-2 text-3xl text-paper transition-opacity hover:opacity-70 md:right-8 md:flex md:items-center md:justify-center"
									onClick={(event) => {
										event.stopPropagation();
										goRelative(1);
									}}
									onPointerDown={(event) => event.stopPropagation()}>
									›
								</button>
							) : null}

							<div
								className="flex max-h-[90dvh] w-full max-w-full touch-pan-y flex-col items-center gap-4 select-none"
								onClick={(event) => event.stopPropagation()}>
								<div
									className="flex max-h-[min(90dvh,calc(90dvh-5rem))] w-full max-w-full flex-col items-center gap-4 transition-opacity ease-out"
									style={{
										opacity: slideVisible ? 1 : 0,
										transitionDuration: `${SLIDE_FADE_MS}ms`,
									}}>
									<span className="relative flex max-h-[min(90dvh,calc(90dvh-5rem))] max-w-full items-center justify-center">
										{!imageLoaded ? (
											<span className="relative block h-[50vh] w-[min(90vw,800px)] overflow-hidden opacity-40">
												<ImageSkeleton />
											</span>
										) : null}
										<Image
											key={lightboxSrc}
											src={lightboxSrc}
											alt={current.alt}
											width={2400}
											height={2400}
											quality={95}
											draggable={false}
											className={`max-h-[min(90dvh,calc(90dvh-5rem))] w-auto max-w-full object-contain ${
												imageLoaded ? 'opacity-100' : 'absolute opacity-0'
											}`}
											onLoad={revealSlide}
											onError={revealSlide}
										/>
									</span>
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
