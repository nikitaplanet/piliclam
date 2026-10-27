import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [{protocol: 'https', hostname: 'cdn.sanity.io'}],
		qualities: [75, 90],
	},
	turbopack: {
		rules: {
			'*.css': {
				loaders: ['@tailwindcss/turbopack'],
				as: '*.css',
			},
		},
	},
};

export default nextConfig;
