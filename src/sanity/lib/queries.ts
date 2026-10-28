import {defineQuery} from 'next-sanity';

export const HOME_PAGE_QUERY = defineQuery(`*[_id == "homePage"][0]{
  banner
}`);

const imageWithExif = /* groq */ `{
  ...,
  asset->{
    _id,
    url,
    metadata {
      exif,
      image
    }
  }
}`;

/** entryType 缺省視為 blog（相容舊資料） */
export const POSTS_QUERY = defineQuery(`*[
  _type == "post"
  && defined(slug.current)
  && (
    $entryType == "blog" && (!defined(entryType) || entryType == "blog")
    || entryType == $entryType
  )
] | order(publishedAt desc) {
  _id, title, slug, publishedAt, excerpt, mainImage, entryType
}`);

export const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  ...,
  mainImage ${imageWithExif},
  body[]{
    ...,
    _type == "image" => ${imageWithExif}
  },
  galleryImages[] ${imageWithExif}
}`);
