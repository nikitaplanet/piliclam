import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText, type PortableTextComponents } from 'next-sanity';
import PostDate from '@/components/atoms/PostDate';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { POST_QUERY } from '@/sanity/lib/queries';

const options = { next: { revalidate: 60 } };

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <Image
        src={urlFor(value).width(800).url()}
        alt={value.alt || ''}
        width={800}
        height={450}
        className="h-auto w-full rounded-lg"
        loading="lazy"
      />
    ),
  },
};

export default async function PostContent({ slug }: { slug: string }) {
  const post = await client.fetch(POST_QUERY, { slug }, options);
  if (!post) notFound();

  return (
    <article>
      <h1 className="mb-2 text-3xl font-bold">{post.title}</h1>
      {post.publishedAt ? <PostDate value={post.publishedAt} /> : null}
      {post.mainImage ? (
        <Image
          src={urlFor(post.mainImage).width(1200).url()}
          alt=""
          width={1200}
          height={600}
          className="my-8 h-auto w-full rounded-lg"
          priority
        />
      ) : null}
      <div className="prose max-w-none">
        <PortableText value={post.body} components={components} />
      </div>
    </article>
  );
}
