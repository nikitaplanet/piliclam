import ContentShell from '@/components/atoms/ContentShell';
import PageFadeIn from '@/components/atoms/PageFadeIn';
import PostsList from '@/components/organisms/PostsList';

export default function LifePage() {
	return (
		<PageFadeIn>
			<ContentShell>
				<PostsList />
			</ContentShell>
		</PageFadeIn>
	);
}
