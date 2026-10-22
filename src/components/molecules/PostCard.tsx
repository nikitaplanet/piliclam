import Image from 'next/image';
import Link from 'next/link';
import PostDate from '@/components/atoms/PostDate';
import { urlFor } from '@/sanity/lib/image';

type PostCardProps = {
  post: {
    title: string;
    slug: { current: string };
    publishedAt?: string;
    excerpt?: string;
    mainImage?: unknown;
  };
  priority?: boolean;
};

export default function PostCard({ post, priority = false }: PostCardProps) {
  return (
    <article>
      {post.mainImage ? (
        <Image
          src={urlFor(post.mainImage).width(1200).height(600).url()}
          alt={post.title}
          width={1200}
          height={600}
          className="mb-4 h-auto w-full rounded-lg"
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
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
