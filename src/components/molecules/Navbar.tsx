'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

const menuItemClass = (active: boolean) =>
	`border-b-2 pb-0.5 text-sm lowercase transition-colors ${
		active ? 'border-foreground text-foreground' : 'border-transparent text-gray-500 hover:text-foreground'
	}`;

export default function Navbar() {
	const pathname = usePathname();
	const homeActive = pathname === '/';
	const worksActive = pathname === '/works' || pathname.startsWith('/works/');
	const blogsActive = pathname === '/blogs' || pathname.startsWith('/posts/');

	return (
		<nav className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-background/95 px-5 py-4 backdrop-blur-sm md:px-10">
			<div className="flex items-center gap-8">
				<Link href="/" className="text-base font-semibold lowercase tracking-wide">
					piliclam
				</Link>
				<Link href="/" className={menuItemClass(homeActive)}>
					home
				</Link>
				<Link href="/works" className={menuItemClass(worksActive)}>
					works
				</Link>
				<Link href="/blogs" className={menuItemClass(blogsActive)}>
					blogs
				</Link>
			</div>
		</nav>
	);
}
