'use client';

import {useEffect, useRef, type ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import {ReactLenis, type LenisRef} from 'lenis/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

const LIFE_SCROLL_KEY = 'piliclam:life-scroll';

function isLifePath(path: string) {
	return path === '/life';
}

function isPostPath(path: string) {
	return path.startsWith('/posts/');
}

export default function SmoothScroll({children}: {children: ReactNode}) {
	const lenisRef = useRef<LenisRef>(null);
	const pathname = usePathname();
	const prevPathRef = useRef(pathname);

	useEffect(() => {
		function update(time: number) {
			lenisRef.current?.lenis?.raf(time * 1000);
		}
		gsap.ticker.add(update);
		gsap.ticker.lagSmoothing(0);
		return () => gsap.ticker.remove(update);
	}, []);

	// 關掉瀏覽器預設捲動還原，改由 Lenis 手動處理
	useEffect(() => {
		if ('scrollRestoration' in history) {
			history.scrollRestoration = 'manual';
		}
	}, []);

	useEffect(() => {
		const lenis = lenisRef.current?.lenis;
		if (!lenis) return;

		const prev = prevPathRef.current;
		const next = pathname;
		prevPathRef.current = next;

		if (prev === next) return;

		// 離開列表進詳細頁：記住位置
		if (isLifePath(prev) && isPostPath(next)) {
			try {
				sessionStorage.setItem(LIFE_SCROLL_KEY, String(lenis.scroll));
			} catch {
				/* ignore */
			}
		}

		// 詳細頁：一律置頂
		if (isPostPath(next)) {
			lenis.scrollTo(0, {immediate: true});
			ScrollTrigger.refresh();
			return;
		}

		// 從詳細頁返回列表：還原位子
		if (isLifePath(next) && isPostPath(prev)) {
			let y = 0;
			try {
				y = Number(sessionStorage.getItem(LIFE_SCROLL_KEY) || 0);
			} catch {
				y = 0;
			}

			const restore = () => {
				lenis.scrollTo(y, {immediate: true});
				ScrollTrigger.refresh();
			};

			// 等列表 layout 起來再還原
			requestAnimationFrame(() => {
				requestAnimationFrame(restore);
			});
			return;
		}

		// 其他換頁：置頂
		lenis.scrollTo(0, {immediate: true});
		ScrollTrigger.refresh();
	}, [pathname]);

	return (
		<ReactLenis root options={{autoRaf: false}} ref={lenisRef}>
			{children}
		</ReactLenis>
	);
}
