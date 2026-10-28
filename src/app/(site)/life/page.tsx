import ContentShell from '@/components/atoms/ContentShell';
import PageFadeIn from '@/components/atoms/PageFadeIn';
import LifeTypeTabs from '@/components/molecules/LifeTypeTabs';
import PostsList from '@/components/organisms/PostsList';
import {parseLifeEntryType} from '@/lib/lifeEntry';

type Props = {
	searchParams: Promise<{tab?: string | string[]}>;
};

export default async function LifePage({searchParams}: Props) {
	const params = await searchParams;
	const entryType = parseLifeEntryType(params.tab);

	return (
		<PageFadeIn>
			<main>
				{/* 桌面：對齊 navbar 左側間距（px-5 / md:px-10），不擠動內容區 */}
				<aside className="pointer-events-none fixed top-[calc(3.5rem+50px)] left-0 z-10 hidden px-5 md:pointer-events-auto md:block md:px-10">
					<div className="pointer-events-auto pt-2">
						<LifeTypeTabs active={entryType} />
					</div>
				</aside>

				<ContentShell>
					<h1 className="text-center text-5xl font-semibold lowercase">Life</h1>
					{/* 手機：維持標題下方橫向 tabs */}
					<div className="mt-10 md:hidden">
						<LifeTypeTabs active={entryType} />
					</div>
					<div className="mt-10">
						<PostsList entryType={entryType} />
					</div>
				</ContentShell>
			</main>
		</PageFadeIn>
	);
}
