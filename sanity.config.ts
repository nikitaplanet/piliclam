'use client';

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision';
import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';

import {apiVersion, dataset, projectId} from './src/sanity/env';
import StudioLayout from './src/sanity/components/StudioLayout';
import StudioLogo from './src/sanity/components/StudioLogo';
import {schema} from './src/sanity/schemaTypes';
import {structure} from './src/sanity/structure';
import {studioTheme} from './src/sanity/theme';
import {brandName} from './src/theme/brand';

export default defineConfig({
	name: 'default',
	title: brandName,
	basePath: '/studio',
	projectId,
	dataset,
	schema,
	theme: studioTheme,
	studio: {
		components: {
			logo: StudioLogo,
			layout: StudioLayout,
		},
	},
	plugins: [structureTool({structure}), visionTool({defaultApiVersion: apiVersion})],
});
