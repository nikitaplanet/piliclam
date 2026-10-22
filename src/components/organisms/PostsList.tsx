import FadeIn from '@/components/atoms/FadeIn';
import PostCard from '@/components/molecules/PostCard';
import { client } from '@/sanity/lib/client';
import { POSTS_QUERY } from '@/sanity/lib/queries';

const options = { next: { revalidate: 60 } };

export default async function PostsList() {
  const posts = await client.fetch(POSTS_QUERY, {}, options);

  if (!posts?.length) {
    return <p className="text-gray-500">尚無文章</p>;
  }

  return (
    <main className="space-y-12">
      {posts.map((post: any, index: number) => (
        <FadeIn key={post._id}>
          <PostCard post={post} priority={index === 0} />
        </FadeIn>
      ))}
    </main>
  );
}
