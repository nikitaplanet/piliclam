export const LIFE_ENTRY_TYPES = ['blog', 'gallery'] as const;

export type LifeEntryType = (typeof LIFE_ENTRY_TYPES)[number];

export function parseLifeEntryType(value: string | string[] | undefined): LifeEntryType {
	const raw = Array.isArray(value) ? value[0] : value;
	return raw === 'gallery' ? 'gallery' : 'blog';
}

export function lifeListHref(entryType: LifeEntryType) {
	return entryType === 'gallery' ? '/life?tab=gallery' : '/life';
}

export function resolveEntryType(entryType: string | null | undefined): LifeEntryType {
	return entryType === 'gallery' ? 'gallery' : 'blog';
}
