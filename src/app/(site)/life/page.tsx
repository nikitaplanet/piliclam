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
			<ContentShell>
				<main>
					<h1 className="text-center text-5xl font-semibold lowercase">Life</h1>
					<div className="mt-10 flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
						<aside className="shrink-0 md:sticky md:top-[calc(3.5rem+50px)] md:w-28">
							<LifeTypeTabs active={entryType} />
						</aside>
						<div className="min-w-0 flex-1">
							<PostsList entryType={entryType} />
						</div>
					</div>
				</main>
			</ContentShell>
		</PageFadeIn>
	);
}
