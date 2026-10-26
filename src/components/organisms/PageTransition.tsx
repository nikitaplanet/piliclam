'use client';

import {useEffect, useRef, useState, type ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function PageTransition({children}: {children: ReactNode}) {
	const pathname = usePathname();
	const containerRef = useRef<HTMLDivElement>(null);
	const childrenRef = useRef(children);
	const pathRef = useRef(pathname);
	const isFirstRender = useRef(true);
	const [displayChildren, setDisplayChildren] = useState(children);

	childrenRef.current = children;

	useEffect(() => {
		if (pathRef.current === pathname) {
			setDisplayChildren(children);
		}
	}, [children, pathname]);

	useGSAP(
		() => {
			const el = containerRef.current;
			if (!el) return;

			const mm = gsap.matchMedia();

			mm.add('(prefers-reduced-motion: reduce)', () => {
				pathRef.current = pathname;
				setDisplayChildren(childrenRef.current);
				gsap.set(el, {opacity: 1, y: 0});
			});

			mm.add('(prefers-reduced-motion: no-preference)', () => {
				if (isFirstRender.current) {
					isFirstRender.current = false;
					pathRef.current = pathname;
					setDisplayChildren(childrenRef.current);
					gsap.fromTo(el, {opacity: 0, y: 8}, {opacity: 1, y: 0, duration: 0.4, ease: 'power2.out'});
					return;
				}

				if (pathRef.current === pathname) return;

				gsap.to(el, {
					opacity: 0,
					y: -6,
					duration: 0.22,
					ease: 'power1.in',
					onComplete: () => {
						pathRef.current = pathname;
						setDisplayChildren(childrenRef.current);
						gsap.fromTo(
							el,
							{opacity: 0, y: 8},
							{
								opacity: 1,
								y: 0,
								duration: 0.4,
								ease: 'power2.out',
							},
						);
					},
				});
			});
		},
		{dependencies: [pathname], scope: containerRef},
	);

	return (
		<div ref={containerRef} className="min-h-[50vh]">
			{displayChildren}
		</div>
	);
}
