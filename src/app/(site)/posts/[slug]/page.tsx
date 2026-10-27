import type {Metadata} from 'next';
import ContentShell from '@/components/atoms/ContentShell';
import PageFadeIn from '@/components/atoms/PageFadeIn';
import PostContent from '@/components/organisms/PostContent';
import {client} from '@/sanity/lib/client';
import {hasImageAsset, urlFor} from '@/sanity/lib/image';
import {POST_QUERY} from '@/sanity/lib/queries';

const options = {next: {revalidate: 60}};

type Props = {params: Promise<{slug: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
	const {slug} = await params;
	const post = await client.fetch(POST_QUERY, {slug}, options);
	if (!post) return {};
	return {
		title: post.title,
		description: post.excerpt,
		openGraph: {
			title: post.title,
			description: post.excerpt,
			images: hasImageAsset(post.mainImage)
				? [urlFor(post.mainImage).width(1200).height(630).auto('format').quality(90).url()]
				: [],
		},
	};
}

export default async function PostPage({params}: Props) {
	const {slug} = await params;
	return (
		<PageFadeIn>
			<ContentShell>
				<PostContent slug={slug} />
			</ContentShell>
		</PageFadeIn>
	);
}
