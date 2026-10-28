import type {ImageMetadataSource} from '@/lib/formatPhotoExif';
import {hasImageAsset} from '@/sanity/lib/image';
import type {SanityImageSource} from '@sanity/image-url';

export type GalleryImage = {
	key?: string;
	value: SanityImageSource & ImageMetadataSource;
	alt: string;
	caption?: string;
};

function assetKey(value: SanityImageSource & ImageMetadataSource): string {
	const asset = value?.asset as {_ref?: string; _id?: string} | undefined;
	return asset?._ref ?? asset?._id ?? '';
}

type ImageBlock = {
	_key?: string;
	_type?: string;
	alt?: string;
	caption?: string;
} & SanityImageSource &
	ImageMetadataSource;

/** 封面圖 + 內文圖，依出現順序組成幻燈片清單（部落格） */
export function collectPostGalleryImages(post: {
	mainImage?: (SanityImageSource & ImageMetadataSource) | null;
	body?: ImageBlock[] | null;
}): GalleryImage[] {
	const items: GalleryImage[] = [];

	if (hasImageAsset(post.mainImage)) {
		items.push({value: post.mainImage as SanityImageSource & ImageMetadataSource, alt: ''});
	}

	for (const block of post.body ?? []) {
		if (block?._type === 'image' && hasImageAsset(block)) {
			items.push({key: block._key, value: block, alt: block.alt || '', caption: block.caption});
		}
	}

	return items;
}

/** 藝廊多圖（不含封面，封面僅作列表縮圖） */
export function collectGalleryEntryImages(post: {galleryImages?: ImageBlock[] | null}): GalleryImage[] {
	const items: GalleryImage[] = [];

	for (const image of post.galleryImages ?? []) {
		if (hasImageAsset(image)) {
			items.push({
				key: image._key,
				value: image,
				alt: image.alt || '',
				caption: image.caption,
			});
		}
	}

	return items;
}

export function findGalleryIndex(images: GalleryImage[], value: SanityImageSource & ImageMetadataSource): number {
	const key = assetKey(value);
	if (!key) return -1;
	return images.findIndex((item) => assetKey(item.value) === key);
}
