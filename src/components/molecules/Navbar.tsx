'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const homeActive = pathname === '/';
  const blogsActive = pathname === '/blogs' || pathname.startsWith('/posts/');

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-background/95 px-5 py-4 backdrop-blur-sm md:px-10">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="text-base font-semibold lowercase tracking-wide"
        >
          piliclam
        </Link>
        <Link
          href="/"
          className={`text-sm lowercase transition-colors ${
            homeActive
              ? 'text-foreground'
              : 'text-gray-500 hover:text-foreground'
          }`}
        >
          home
        </Link>
        <Link
          href="/blogs"
          className={`text-sm lowercase transition-colors ${
            blogsActive
              ? 'text-foreground'
              : 'text-gray-500 hover:text-foreground'
          }`}
        >
          blogs
        </Link>
      </div>
    </nav>
  );
}
