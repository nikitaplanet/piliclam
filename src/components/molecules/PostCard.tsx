import Link from 'next/link';
import type { SanityImageSource } from '@sanity/image-url';
import PostDate from '@/components/atoms/PostDate';
import SanityImage from '@/components/atoms/SanityImage';

type PostCardProps = {
  post: {
    title: string;
    slug: { current: string };
    publishedAt?: string;
    excerpt?: string;
    mainImage?: SanityImageSource;
  };
  priority?: boolean;
};

export default function PostCard({ post, priority = false }: PostCardProps) {
  return (
    <article>
      {post.mainImage ? (
        <SanityImage
          value={post.mainImage}
          alt={post.title}
          width={1200}
          height={600}
          className="mb-4 w-full rounded-lg"
          priority={priority}
          sizes="(max-width: 768px) 100vw, 720px"
        />
      ) : null}
      <h2 className="text-xl font-semibold">
        <Link href={`/posts/${post.slug.current}`} className="hover:underline">
          {post.title}
        </Link>
      </h2>
      {post.publishedAt ? <PostDate value={post.publishedAt} /> : null}
      {post.excerpt ? <p className="mt-2">{post.excerpt}</p> : null}
    </article>
  );
}
