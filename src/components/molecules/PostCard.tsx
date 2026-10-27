import Link from 'next/link';
import type {SanityImageSource} from '@sanity/image-url';
import PostDate from '@/components/atoms/PostDate';
import SanityImage from '@/components/atoms/SanityImage';

type PostCardProps = {
	post: {
		title: string;
		slug: {current: string};
		publishedAt?: string;
		excerpt?: string;
		mainImage?: SanityImageSource;
	};
	priority?: boolean;
};

export default function PostCard({post, priority = false}: PostCardProps) {
	return (
		<article>
			<Link href={`/posts/${post.slug.current}`} className="group block outline-offset-4">
				{post.mainImage ? (
					<div className="mb-4 transition-[filter,box-shadow] duration-300 group-hover:brightness-110 group-hover:shadow-lg">
						<SanityImage
							value={post.mainImage}
							alt={post.title}
							width={2000}
							height={1000}
							fit="max"
							className="w-full"
							priority={priority}
							sizes="(max-width: 1000px) 100vw, 1000px"
						/>
					</div>
				) : null}
				<div className="transition-opacity group-hover:opacity-80">
					<h2 className="text-xl font-semibold">{post.title}</h2>
					{post.publishedAt ? <PostDate value={post.publishedAt} className="text-base text-gray-500" /> : null}
					{post.excerpt ? <p className="mt-2">{post.excerpt}</p> : null}
				</div>
			</Link>
		</article>
	);
}
