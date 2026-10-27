import type {ImageMetadataSource} from '@/lib/formatPhotoExif';
import type {SanityImageSource} from '@sanity/image-url';

export type GalleryImage = {
	value: SanityImageSource & ImageMetadataSource;
	alt: string;
};

function assetKey(value: SanityImageSource & ImageMetadataSource): string {
	const asset = value?.asset as {_ref?: string; _id?: string} | undefined;
	return asset?._ref ?? asset?._id ?? '';
}

/** 封面圖 + 內文圖，依出現順序組成幻燈片清單 */
export function collectPostGalleryImages(post: {
	mainImage?: (SanityImageSource & ImageMetadataSource) | null;
	body?: Array<{_type?: string; alt?: string} & SanityImageSource & ImageMetadataSource> | null;
}): GalleryImage[] {
	const items: GalleryImage[] = [];

	if (post.mainImage) {
		items.push({value: post.mainImage, alt: ''});
	}

	for (const block of post.body ?? []) {
		if (block?._type === 'image') {
			items.push({value: block, alt: block.alt || ''});
		}
	}

	return items;
}

export function findGalleryIndex(images: GalleryImage[], value: SanityImageSource & ImageMetadataSource): number {
	const key = assetKey(value);
	if (!key) return -1;
	return images.findIndex((item) => assetKey(item.value) === key);
}
