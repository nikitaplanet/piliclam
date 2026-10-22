import { Suspense } from 'react';
import DotLoading from '@/components/atoms/DotLoading';
import HomeBanner from '@/components/organisms/HomeBanner';

export default function HomePage() {
  return (
    <Suspense fallback={<DotLoading />}>
      <HomeBanner />
    </Suspense>
  );
}
