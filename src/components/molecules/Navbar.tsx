'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

const menuItemClass = (active: boolean) =>
	`relative text-lg lowercase transition-colors ${active ? 'font-bold text-primary' : 'text-black hover:font-bold hover:text-primary'}`;

function MenuDot({active}: {active: boolean}) {
	if (!active) return null;

	return <span aria-hidden className="absolute top-full left-1/2 mt-1 size-1 -translate-x-1/2 rounded-full bg-primary" />;
}

export default function Navbar() {
	const pathname = usePathname();
	const homeActive = pathname === '/';
	const worksActive = pathname === '/works' || pathname.startsWith('/works/');
	const blogsActive = pathname === '/blogs' || pathname.startsWith('/posts/');
	const contactActive = pathname === '/contact' || pathname.startsWith('/contact/');

	return (
		<nav className="fixed inset-x-0 top-0 z-50 bg-background/95 px-5 py-4 backdrop-blur-sm md:px-10">
			<div className="flex items-center gap-16">
				<Link href="/" className="font-sans text-xl font-bold tracking-wider">
					NIKITA L
				</Link>
				<Link href="/" className={menuItemClass(homeActive)}>
					home
					<MenuDot active={homeActive} />
				</Link>
				<Link href="/works" className={menuItemClass(worksActive)}>
					works
					<MenuDot active={worksActive} />
				</Link>
				<Link href="/blogs" className={menuItemClass(blogsActive)}>
					blogs
					<MenuDot active={blogsActive} />
				</Link>
				<Link href="/contact" className={menuItemClass(contactActive)}>
					contact
					<MenuDot active={contactActive} />
				</Link>
			</div>
		</nav>
	);
}
