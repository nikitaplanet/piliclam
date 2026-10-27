import {notFound} from 'next/navigation';
import {PortableText, type PortableTextComponents} from 'next-sanity';
import PostDate from '@/components/atoms/PostDate';
import SanityImage from '@/components/atoms/SanityImage';
import {client} from '@/sanity/lib/client';
import {POST_QUERY} from '@/sanity/lib/queries';
import type {SanityImageSource} from '@sanity/image-url';

const options = {next: {revalidate: 60}};

const components: PortableTextComponents = {
	types: {
		image: ({value}) => (
			<SanityImage
				value={value as SanityImageSource}
				alt={value.alt || ''}
				width={800}
				height={450}
				className="w-full"
				sizes="(max-width: 768px) 100vw, 800px"
			/>
		),
	},
};

export default async function PostContent({slug}: {slug: string}) {
	const post = await client.fetch(POST_QUERY, {slug}, options);
	if (!post) notFound();

	return (
		<article>
			<h1 className="mb-2 text-3xl font-bold">{post.title}</h1>
			{post.publishedAt ? <PostDate value={post.publishedAt} /> : null}
			{post.mainImage ? (
				<SanityImage
					value={post.mainImage as SanityImageSource}
					alt=""
					width={1200}
					height={600}
					className="my-8 w-full"
					priority
					sizes="(max-width: 768px) 100vw, 800px"
				/>
			) : null}
			<div className="prose max-w-none">
				<PortableText value={post.body} components={components} />
			</div>
		</article>
	);
}
