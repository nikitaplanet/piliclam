import {notFound} from 'next/navigation';
import {PortableText, type PortableTextComponents} from 'next-sanity';
import PostDate from '@/components/atoms/PostDate';
import LightboxImage from '@/components/molecules/LightboxImage';
import PostGallery from '@/components/organisms/PostGallery';
import {collectPostGalleryImages, findGalleryIndex} from '@/lib/postGallery';
import {client} from '@/sanity/lib/client';
import {POST_QUERY} from '@/sanity/lib/queries';
import type {SanityImageSource} from '@sanity/image-url';
import type {ImageMetadataSource} from '@/lib/formatPhotoExif';

const options = {next: {revalidate: 60}};

export default async function PostContent({slug}: {slug: string}) {
	const post = await client.fetch(POST_QUERY, {slug}, options);
	if (!post) notFound();

	const images = collectPostGalleryImages(post);

	const components: PortableTextComponents = {
		types: {
			image: ({value}) => {
				const source = value as SanityImageSource & ImageMetadataSource;
				const galleryIndex = findGalleryIndex(images, source);
				return (
					<LightboxImage
						value={source}
						alt={value.alt || ''}
						width={2000}
						height={1125}
						sizes="(max-width: 1000px) 100vw, 1000px"
						galleryIndex={galleryIndex >= 0 ? galleryIndex : undefined}
					/>
				);
			},
		},
	};

	return (
		<PostGallery images={images}>
			<article>
				<h1 className="mb-2 text-3xl font-bold">{post.title}</h1>
				{post.publishedAt ? <PostDate value={post.publishedAt} className="text-lg text-gray-500" /> : null}
				{post.mainImage ? (
					<LightboxImage
						value={post.mainImage as SanityImageSource & ImageMetadataSource}
						alt=""
						width={2000}
						height={1000}
						className="my-8"
						priority
						sizes="(max-width: 1000px) 100vw, 1000px"
						galleryIndex={0}
					/>
				) : null}
				<div className="prose max-w-none">
					<PortableText value={post.body} components={components} />
				</div>
			</article>
		</PostGallery>
	);
}
