import type {StructureResolver} from 'sanity/structure';

const SINGLETONS = ['homePage'];

export const structure: StructureResolver = (S) =>
	S.list()
		.title('Content')
		.items([
			S.listItem().title('首頁').id('homePage').child(S.document().schemaType('homePage').documentId('homePage').title('首頁')),
			S.divider(),
			S.listItem()
				.title('Life')
				.id('life')
				.child(
					S.list()
						.title('Life')
						.items([
							S.listItem()
								.title('部落格')
								.id('life-blog')
								.child(
									S.documentList()
										.id('life-blog-list')
										.title('部落格')
										.schemaType('post')
										.filter('_type == "post" && (!defined(entryType) || entryType == "blog")')
										.defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
										.initialValueTemplates([S.initialValueTemplateItem('post-blog')]),
								),
							S.listItem()
								.title('藝廊')
								.id('life-gallery')
								.child(
									S.documentList()
										.id('life-gallery-list')
										.title('藝廊')
										.schemaType('post')
										.filter('_type == "post" && entryType == "gallery"')
										.defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
										.initialValueTemplates([S.initialValueTemplateItem('post-gallery')]),
								),
							S.divider(),
							S.listItem()
								.title('全部')
								.id('life-all')
								.child(
									S.documentList()
										.id('life-all-list')
										.title('全部 Life')
										.schemaType('post')
										.filter('_type == "post"')
										.defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
								),
						]),
				),
			...S.documentTypeListItems().filter((listItem) => !SINGLETONS.includes(listItem.getId() as string) && listItem.getId() !== 'post'),
		]);
