import ContentShell from '@/components/atoms/ContentShell';
import PageFadeIn from '@/components/atoms/PageFadeIn';

export default function WorksPage() {
	return (
		<PageFadeIn>
			<ContentShell>
				<main>
					<h1 className="text-5xl font-semibold lowercase text-center">Works</h1>
					<p className="mt-10 text-center text-gray-500">即將推出</p>
				</main>
			</ContentShell>
		</PageFadeIn>
	);
}
