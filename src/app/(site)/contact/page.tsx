import Image from 'next/image';
import ContentShell from '@/components/atoms/ContentShell';
import PageFadeIn from '@/components/atoms/PageFadeIn';

export default function ContactPage() {
	return (
		<PageFadeIn>
			<ContentShell>
				<main>
					<h1 className="text-5xl font-semibold lowercase text-center">Contact</h1>
					<div className="mt-10 flex flex-col items-center justify-center gap-20">
						<p className="mt-4 text-center text-xl">Mail : sinrulyu@gmail.com</p>
						<p className="h-px w-5 bg-gray-400"></p>
						<p className="text-center text-lg">
							I typically reply within 1–2 business days.
							<br /> Looking forward to connecting.
						</p>
						<div className="w-full max-w-[400px]">
							<Image src="/contact.jpg" alt="Contact" width={400} height={267} className="h-auto w-full" sizes="400px" priority />
						</div>
					</div>
				</main>
			</ContentShell>
		</PageFadeIn>
	);
}
