import type { ReactNode } from 'react';
import Navbar from '@/components/molecules/Navbar';
import SiteFooter from '@/components/molecules/SiteFooter';
import PageTransition from '@/components/organisms/PageTransition';
import SmoothScroll from '@/components/organisms/SmoothScroll';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <Navbar />
      <div className="flex min-h-dvh flex-col pt-[calc(3.5rem+50px)]">
        <div className="flex-1">
          <PageTransition>{children}</PageTransition>
        </div>
        <SiteFooter />
      </div>
    </SmoothScroll>
  );
}
