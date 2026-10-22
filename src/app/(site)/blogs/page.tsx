import { Suspense } from 'react';
import ContentShell from '@/components/atoms/ContentShell';
import DotLoading from '@/components/atoms/DotLoading';
import PostsList from '@/components/organisms/PostsList';

export default function BlogsPage() {
  return (
    <ContentShell>
      <Suspense fallback={<DotLoading />}>
        <PostsList />
      </Suspense>
    </ContentShell>
  );
}
