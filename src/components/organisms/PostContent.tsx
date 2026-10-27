import {notFound} from 'next/navigation';
import {PortableText, type PortableTextComponents} from 'next-sanity';
import PostDate from '@/components/atoms/PostDate';
import LightboxImage from '@/components/molecules/LightboxImage';
import {client} from '@/sanity/lib/client';
import {POST_QUERY} from '@/sanity/lib/queries';
import type {SanityImageSource} from '@sanity/image-url';

const options = {next: {revalidate: 60}};

const components: PortableTextComponents = {
	types: {
		image: ({value}) => (
			<LightboxImage
				value={value as SanityImageSource}
				alt={value.alt || ''}
				width={2000}
				height={1125}
				sizes="(max-width: 1000px) 100vw, 1000px"
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
			{post.publishedAt ? <PostDate value={post.publishedAt} className="text-lg text-gray-500" /> : null}
			{post.mainImage ? (
				<LightboxImage
					value={post.mainImage as SanityImageSource}
					alt=""
					width={2000}
					height={1000}
					className="my-8"
					priority
					sizes="(max-width: 1000px) 100vw, 1000px"
				/>
			) : null}
			<div className="prose max-w-none">
				<PortableText value={post.body} components={components} />
			</div>
		</article>
	);
}
