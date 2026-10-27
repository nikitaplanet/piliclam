import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url';
import {client} from './client';

const builder = createImageUrlBuilder(client);

export const urlFor = (source: SanityImageSource) => builder.image(source);

/** asset 為 null／缺 _ref／_id 時 urlFor 會炸，先擋掉 */
export function hasImageAsset(source: unknown): source is SanityImageSource {
	if (!source || typeof source !== 'object') return false;
	const asset = (source as {asset?: {_ref?: string; _id?: string; url?: string} | null}).asset;
	if (!asset || typeof asset !== 'object') return false;
	return Boolean(asset._ref || asset._id || asset.url);
}
