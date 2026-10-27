'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {brandName} from '@/theme/brand';

const menuItemClass = (active: boolean) =>
	`text-lg lowercase transition-colors ${active ? 'font-bold text-primary' : 'text-black hover:font-bold hover:text-primary'}`;

export default function Navbar() {
	const pathname = usePathname();
	const homeActive = pathname === '/';
	const worksActive = pathname === '/works' || pathname.startsWith('/works/');
	const lifeActive = pathname === '/life' || pathname.startsWith('/posts/');
	const contactActive = pathname === '/contact' || pathname.startsWith('/contact/');

	return (
		<nav className="fixed inset-x-0 top-0 z-50 bg-background/95 px-5 py-4 backdrop-blur-sm md:px-10">
			<div className="flex items-center gap-16">
				<Link href="/" className="font-sans text-xl font-bold tracking-wider text-black">
					{brandName}
				</Link>
				<Link href="/" className={menuItemClass(homeActive)}>
					home
				</Link>
				<Link href="/works" className={menuItemClass(worksActive)}>
					works
				</Link>
				<Link href="/life" className={menuItemClass(lifeActive)}>
					life
				</Link>
				<Link href="/contact" className={menuItemClass(contactActive)}>
					contact
				</Link>
			</div>
		</nav>
	);
}
