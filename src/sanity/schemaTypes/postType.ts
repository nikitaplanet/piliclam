import {defineArrayMember, defineField, defineType, type ImageMetadataType} from 'sanity';
import {WidePortableTextInput} from '../components/WidePortableTextInput';

const imageMetadataOptions = {
	hotspot: true,
	metadata: ['exif', 'image', 'lqip', 'palette', 'blurhash'] satisfies ImageMetadataType[],
};

const isGallery = (document: unknown) =>
	Boolean(document && typeof document === 'object' && 'entryType' in document && document.entryType === 'gallery');

export const postType = defineType({
	name: 'post',
	title: 'Life',
	type: 'document',
	fields: [
		defineField({
			name: 'entryType',
			title: '類型',
			type: 'string',
			options: {
				list: [
					{title: '部落格', value: 'blog'},
					{title: '藝廊', value: 'gallery'},
					// 預留未來擴充：例如 journal、notes 等
				],
				layout: 'radio',
			},
			initialValue: 'blog',
		}),
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
			validation: (rule) =>
				rule.custom((value, context) => {
					if (!isGallery(context.document)) return true;
					const asset = value && typeof value === 'object' && 'asset' in value ? value.asset : undefined;
					return asset ? true : '藝廊封面為必填';
				}),
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
			hidden: ({document}) => isGallery(document),
			components: {
				input: WidePortableTextInput,
			},
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
		defineField({
			name: 'galleryImages',
			title: '藝廊圖片',
			type: 'array',
			description: '可上傳多張圖片，每張可加附註',
			hidden: ({document}) => !isGallery(document),
			of: [
				defineArrayMember({
					type: 'image',
					options: {...imageMetadataOptions},
					fields: [
						defineField({
							name: 'alt',
							title: '替代文字',
							type: 'string',
						}),
						defineField({
							name: 'caption',
							title: '附註',
							type: 'string',
						}),
					],
				}),
			],
		}),
	],
	preview: {
		select: {
			title: 'title',
			entryType: 'entryType',
			media: 'mainImage',
			publishedAt: 'publishedAt',
		},
		prepare({title, entryType, media, publishedAt}) {
			const typeLabel = entryType === 'gallery' ? '藝廊' : '部落格';
			const date = publishedAt ? new Date(publishedAt).toLocaleDateString('zh-TW') : '';
			return {
				title: title || '未命名',
				subtitle: [typeLabel, date].filter(Boolean).join(' · '),
				media,
			};
		},
	},
});
