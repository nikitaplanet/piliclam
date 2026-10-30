import GalleryCard from '@/components/molecules/GalleryCard';
import PostCard from '@/components/molecules/PostCard';
import type {LifeEntryType} from '@/lib/lifeEntry';
import {client} from '@/sanity/lib/client';
import {POSTS_QUERY} from '@/sanity/lib/queries';

const options = {next: {revalidate: 60}};

type PostsListProps = {
	entryType?: LifeEntryType;
};

export default async function PostsList({entryType = 'blog'}: PostsListProps) {
	const posts = await client.fetch(POSTS_QUERY, {entryType}, options);

	if (!posts?.length) {
		return <p className="text-gray-500">{entryType === 'gallery' ? '尚無藝廊' : '尚無文章'}</p>;
	}

	if (entryType === 'gallery') {
		return (
			<div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-14">
				{posts.map((post: any, index: number) => (
					<GalleryCard key={post._id} post={post} priority={index < 2} />
				))}
			</div>
		);
	}

	return (
		<div className="space-y-20">
			{posts.map((post: any, index: number) => (
				<PostCard key={post._id} post={post} priority={index === 0} />
			))}
		</div>
	);
}
