import type {Metadata} from 'next';
import {Cormorant_Garamond} from 'next/font/google';
import './globals.css';

const cormorantGaramond = Cormorant_Garamond({
	variable: '--font-cormorant',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: {
		default: 'piliclam',
		template: '%s | piliclam',
	},
	description: 'piliclam',
};

export default function RootLayout({children}: LayoutProps<'/'>) {
	return (
		<html lang="zh-Hant-TW" className={`${cormorantGaramond.variable} h-full antialiased`}>
			<body className={`${cormorantGaramond.className} flex min-h-full flex-col`}>{children}</body>
		</html>
	);
}
