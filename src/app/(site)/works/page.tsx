import ContentShell from '@/components/atoms/ContentShell';
import PageFadeIn from '@/components/atoms/PageFadeIn';

export default function WorksPage() {
	return (
		<PageFadeIn>
			<ContentShell>
				<main>
					<h1 className="text-2xl font-semibold lowercase">works</h1>
					<p className="mt-4 text-gray-500">即將推出</p>
				</main>
			</ContentShell>
		</PageFadeIn>
	);
}
