import type {Metadata} from 'next';
import {Cormorant_Garamond, Noto_Sans_TC, Space_Grotesk} from 'next/font/google';
import {brandName} from '@/theme/brand';
import './globals.css';

const cormorantGaramond = Cormorant_Garamond({
	variable: '--font-cormorant',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
	variable: '--font-space-grotesk',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	display: 'swap',
});

/** 繁中後備：拉丁字仍優先走 Cormorant／Space Grotesk */
const notoSansTC = Noto_Sans_TC({
	variable: '--font-noto-sans',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: {
		default: brandName,
		template: `%s | ${brandName}`,
	},
	description: brandName,
};

export default function RootLayout({children}: LayoutProps<'/'>) {
	return (
		<html lang="zh-Hant-TW" className={`${cormorantGaramond.variable} ${spaceGrotesk.variable} ${notoSansTC.variable} h-full antialiased`}>
			<body className="flex min-h-full flex-col font-sans">{children}</body>
		</html>
	);
}
