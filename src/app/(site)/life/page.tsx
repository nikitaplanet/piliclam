import ContentShell from '@/components/atoms/ContentShell';
import PageFadeIn from '@/components/atoms/PageFadeIn';
import PostsList from '@/components/organisms/PostsList';

export default function LifePage() {
	return (
		<PageFadeIn>
			<ContentShell>
				<main>
					<h1 className="text-5xl font-semibold lowercase text-center">Life</h1>
					<div className="mt-10">
						<PostsList />
					</div>
				</main>
			</ContentShell>
		</PageFadeIn>
	);
}
