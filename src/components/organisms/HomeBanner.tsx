import SanityImage from '@/components/atoms/SanityImage';
import {client} from '@/sanity/lib/client';
import {HOME_PAGE_QUERY} from '@/sanity/lib/queries';

const options = {next: {revalidate: 60}};

export default async function HomeBanner() {
	const home = await client.fetch(HOME_PAGE_QUERY, {}, options);

	if (!home?.banner) {
		return (
			<div className="flex h-[calc(100dvh-3.5rem-50px)] w-full items-center justify-center bg-background px-5 text-sm text-gray-500 md:px-10">
				請至 Studio「首頁」上傳 Banner／封面圖
			</div>
		);
	}

	const alt = home.banner.alt || 'piliclam';

	return (
		<section className="flex h-[calc(100dvh-3.5rem-50px)] w-full items-center justify-center overflow-hidden bg-background px-5">
			<div className="relative top-[-50px] w-full max-w-[1000px]">
				<SanityImage
					value={home.banner}
					alt={alt}
					width={2000}
					height={2000}
					fit="max"
					priority
					className="min-h-0 max-h-full w-full"
					imgClassName="max-h-[calc(100dvh-3.5rem-50px)] object-contain"
					sizes="(max-width: 1000px) 100vw, 1000px"
				/>
			</div>
		</section>
	);
}
