'use client';

import {useRef, type ReactNode} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function FadeIn({children}: {children: ReactNode}) {
	const ref = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const el = ref.current;
			if (!el) return;

			const mm = gsap.matchMedia();
			mm.add('(prefers-reduced-motion: no-preference)', () => {
				// 已在視窗內（剛換頁淡入）就不要再從 opacity 0 播一次，否則會閃兩下
				const rect = el.getBoundingClientRect();
				const alreadyInView = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
				if (alreadyInView) return;

				gsap.from(el, {
					y: 40,
					opacity: 0,
					duration: 0.8,
					ease: 'power2.out',
					scrollTrigger: {trigger: el, start: 'top 85%', once: true},
				});
			});
		},
		{scope: ref},
	);

	return <div ref={ref}>{children}</div>;
}
