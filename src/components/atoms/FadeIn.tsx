'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function FadeIn({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(ref.current, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%' },
        });
      });
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
