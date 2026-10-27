import {defineField, defineType} from 'sanity';

const imageMetadataOptions = {
	hotspot: true,
	metadata: ['exif', 'image', 'lqip', 'palette', 'blurhash'] as const,
};

export const postType = defineType({
	name: 'post',
	title: '文章',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: '標題',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'slug',
			title: '網址代稱',
			type: 'slug',
			options: {source: 'title'},
		}),
		defineField({
			name: 'publishedAt',
			title: '發布時間',
			type: 'datetime',
			initialValue: () => new Date().toISOString(),
		}),
		defineField({
			name: 'mainImage',
			title: '封面圖',
			type: 'image',
			options: {...imageMetadataOptions},
			fields: [
				defineField({
					name: 'alt',
					title: '替代文字',
					type: 'string',
				}),
			],
		}),
		defineField({
			name: 'excerpt',
			title: '摘要',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'body',
			title: '內文',
			type: 'array',
			of: [
				{type: 'block'},
				{
					type: 'image',
					options: {...imageMetadataOptions},
					fields: [
						defineField({
							name: 'alt',
							title: '替代文字',
							type: 'string',
						}),
					],
				},
			],
		}),
	],
});
