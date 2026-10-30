import Link from 'next/link';
import type {SanityImageSource} from '@sanity/image-url';
import PostDate from '@/components/atoms/PostDate';
import SanityImage from '@/components/atoms/SanityImage';

type GalleryCardProps = {
	post: {
		title: string;
		slug: {current: string};
		publishedAt?: string;
		mainImage?: SanityImageSource;
	};
	priority?: boolean;
};

export default function GalleryCard({post, priority = false}: GalleryCardProps) {
	return (
		<article>
			<Link href={`/posts/${post.slug.current}`} className="group block">
				<div className="relative z-0 mb-3 overflow-hidden transition-[filter,box-shadow] duration-500 ease-out group-hover:z-10 group-hover:brightness-110 group-hover:shadow-md">
					{post.mainImage ? (
						<SanityImage
							value={post.mainImage}
							alt={post.title}
							width={800}
							height={800}
							fit="crop"
							className="w-full"
							imgClassName="origin-center transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.02]"
							priority={priority}
							sizes="(max-width: 768px) 50vw, 480px"
						/>
					) : (
						<div className="aspect-square bg-foreground/5" aria-hidden />
					)}
				</div>
				<div className="transition-opacity group-hover:opacity-80">
					<h2 className="text-lg font-semibold leading-snug">{post.title}</h2>
					{post.publishedAt ? <PostDate value={post.publishedAt} className="text-sm text-gray-500" /> : null}
				</div>
			</Link>
		</article>
	);
}
