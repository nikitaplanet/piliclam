import type {Metadata} from 'next';
import {Suspense} from 'react';
import ContentShell from '@/components/atoms/ContentShell';
import DotLoading from '@/components/atoms/DotLoading';
import PostContent from '@/components/organisms/PostContent';
import {client} from '@/sanity/lib/client';
import {urlFor} from '@/sanity/lib/image';
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
			images: post.mainImage ? [urlFor(post.mainImage).width(1200).height(630).url()] : [],
		},
	};
}

async function PostPageBody({params}: Props) {
	const {slug} = await params;
	return <PostContent slug={slug} />;
}

export default function PostPage({params}: Props) {
	return (
		<ContentShell>
			<Suspense fallback={<DotLoading />}>
				<PostPageBody params={params} />
			</Suspense>
		</ContentShell>
	);
}
