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
					<SanityImage
						value={post.mainImage}
						alt={post.title}
						width={2000}
						height={1000}
						fit="max"
						className="mb-4 w-full"
						priority={priority}
						sizes="(max-width: 1000px) 100vw, 1000px"
					/>
				) : null}
				<h2 className="text-xl font-semibold group-hover:underline">{post.title}</h2>
				{post.publishedAt ? <PostDate value={post.publishedAt} /> : null}
				{post.excerpt ? <p className="mt-2">{post.excerpt}</p> : null}
			</Link>
		</article>
	);
}
