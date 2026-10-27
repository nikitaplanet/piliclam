'use client';

import {useRef, type ReactNode} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';

gsap.registerPlugin(useGSAP);

/** 單頁掛載時淡入一次（不做跨路由協調，避免跟 Suspense／圖片搶過場） */
export default function PageFadeIn({children}: {children: ReactNode}) {
	const ref = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const el = ref.current;
			if (!el) return;

			const mm = gsap.matchMedia();
			mm.add('(prefers-reduced-motion: reduce)', () => {
				gsap.set(el, {opacity: 1, y: 0});
			});
			mm.add('(prefers-reduced-motion: no-preference)', () => {
				gsap.fromTo(el, {opacity: 0, y: 8}, {opacity: 1, y: 0, duration: 0.4, ease: 'power2.out'});
			});
		},
		{scope: ref},
	);

	return (
		<div ref={ref} className="min-h-[50vh]">
			{children}
		</div>
	);
}
