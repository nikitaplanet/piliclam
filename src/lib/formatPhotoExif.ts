export type PhotoExif = {
	ExposureTime?: number;
	FNumber?: number;
	FocalLength?: number;
	FocalLengthIn35mmFormat?: number;
	ISO?: number;
	LensModel?: string;
	Make?: string;
	Model?: string;
};

export type ImageMetadataSource = {
	asset?: {
		metadata?: {
			exif?: PhotoExif | null;
			image?: {
				Make?: string;
				Model?: string;
			} | null;
		} | null;
	} | null;
};

function formatExposureTime(seconds: number): string {
	if (seconds >= 1) return `${Number(seconds.toFixed(1))}s`;
	const denom = Math.round(1 / seconds);
	return `1/${denom}s`;
}

function formatFocalLength(exif: PhotoExif): string | null {
	const mm = exif.FocalLengthIn35mmFormat ?? exif.FocalLength;
	if (mm == null) return null;
	return `${Math.round(mm)}mm`;
}

/** 將 Sanity EXIF 組成攝影參數文字，例如：f/1.8 · 1/50s · ISO 250 · 26mm */
export function formatPhotoExif(source: ImageMetadataSource | null | undefined): string | null {
	const exif = source?.asset?.metadata?.exif;
	const imageMeta = source?.asset?.metadata?.image;
	if (!exif && !imageMeta) return null;

	const parts: string[] = [];
	const model = exif?.Model ?? imageMeta?.Model;
	const make = exif?.Make ?? imageMeta?.Make;
	if (model) {
		parts.push(model);
	} else if (make) {
		parts.push(make);
	}

	const focal = exif ? formatFocalLength(exif) : null;
	if (focal) parts.push(focal);

	if (exif?.FNumber != null) {
		parts.push(`f/${Number(exif.FNumber.toFixed(1))}`);
	}

	if (exif?.ExposureTime != null) {
		parts.push(formatExposureTime(exif.ExposureTime));
	}

	if (exif?.ISO != null) {
		parts.push(`ISO ${exif.ISO}`);
	}

	return parts.length > 0 ? parts.join(' · ') : null;
}
