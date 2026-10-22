import { defineQuery } from 'next-sanity';

export const HOME_PAGE_QUERY = defineQuery(`*[_id == "homePage"][0]{
  banner
}`);

export const POSTS_QUERY =
  defineQuery(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id, title, slug, publishedAt, excerpt, mainImage
}`);

export const POST_QUERY = defineQuery(
  `*[_type == "post" && slug.current == $slug][0]`,
);
