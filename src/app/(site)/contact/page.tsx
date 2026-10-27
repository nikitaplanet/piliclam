import ContentShell from '@/components/atoms/ContentShell';

export default function ContactPage() {
	return (
		<ContentShell>
			<main>
				<h1 className="text-5xl font-semibold lowercase text-center">Contact</h1>
				<div className="flex justify-center items-center gap-20 flex-col mt-10">
					<p className="mt-4 text-center text-xl">Mail : sinrulyu@gmail.com</p>
					<p className="w-5 h-px bg-gray-400"></p>
					<p className="text-center text-lg">
						I typically reply within 1–2 business days.
						<br /> Looking forward to connecting.
					</p>
				</div>
			</main>
		</ContentShell>
	);
}
