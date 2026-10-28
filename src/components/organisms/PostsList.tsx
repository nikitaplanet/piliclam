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

	return (
		<div className="space-y-20">
			{posts.map((post: any, index: number) => (
				<PostCard key={post._id} post={post} priority={index === 0} />
			))}
		</div>
	);
}
