import {buildLegacyTheme, defaultTheme, type StudioTheme} from 'sanity';
import {brandColors} from '@/theme/brand';

const {foreground, primary} = brandColors;

/** Studio 介面用純白，避免前台象牙紙色滲進標題列／面板 */
const studioWhite = '#ffffff';

/** 表單預設用 container[1]，改為 800px 讓輸入框跟著加寬 */
const CONTAINERS = [320, 800, 960, 1280, 1600, 1920] as const;

const legacyTheme = buildLegacyTheme({
	'--black': foreground,
	'--white': studioWhite,

	'--gray': '#6b7280',
	'--gray-base': '#6b7280',

	'--component-bg': studioWhite,
	'--component-text-color': foreground,

	'--brand-primary': primary,

	'--default-button-color': '#6b7280',
	'--default-button-primary-color': primary,
	'--default-button-success-color': '#0f9d58',
	'--default-button-warning-color': '#f4b400',
	'--default-button-danger-color': '#db4437',

	'--state-info-color': primary,
	'--state-success-color': '#0f9d58',
	'--state-warning-color': '#f4b400',
	'--state-danger-color': '#db4437',

	'--main-navigation-color': foreground,
	'--main-navigation-color--inverted': studioWhite,

	'--focus-color': foreground,
});

/** Sanity UI v2 用 focusRing 色票控制輸入框 focus，需一併改成黑色 */
function withFocusRingColor<T>(value: T, focusColor: string): T {
	if (Array.isArray(value)) {
		return value.map((item) => withFocusRingColor(item, focusColor)) as T;
	}
	if (value && typeof value === 'object') {
		const next: Record<string, unknown> = {};
		for (const [key, nested] of Object.entries(value)) {
			next[key] = key === 'focusRing' && typeof nested === 'string' ? focusColor : withFocusRingColor(nested, focusColor);
		}
		return next as T;
	}
	return value;
}

const defaultV2 = defaultTheme.v2;

export const studioTheme: StudioTheme = {
	...defaultTheme,
	...legacyTheme,
	color: withFocusRingColor(legacyTheme.color ?? defaultTheme.color, foreground),
	container: [...CONTAINERS],
	v2: defaultV2
		? {
				...defaultV2,
				_version: 2,
				container: [...CONTAINERS],
				color: withFocusRingColor(defaultV2.color, foreground),
			}
		: undefined,
};
