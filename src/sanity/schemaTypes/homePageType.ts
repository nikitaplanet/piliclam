import { defineField, defineType } from 'sanity';

export const homePageType = defineType({
  name: 'homePage',
  title: '首頁',
  type: 'document',
  fields: [
    defineField({
      name: 'banner',
      title: 'Banner／封面圖',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: '替代文字',
          type: 'string',
        }),
      ],
      validation: rule => rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({ title: '首頁' }),
  },
});
