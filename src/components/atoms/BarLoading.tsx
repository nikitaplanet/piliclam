type BarLoadingProps = {
	className?: string;
	label?: string;
};

/** lightbox／深色底用：小 UFO 由左上飛向右下 */
export default function BarLoading({className = '', label = '載入中'}: BarLoadingProps) {
	return (
		<span role="status" aria-live="polite" aria-label={label} className={`pointer-events-none overflow-hidden ${className}`}>
			<span className="sr-only">{label}</span>
			{/* eslint-disable-next-line @next/next/no-img-element -- public SVG loader */}
			<img src="/loading.svg" alt="" aria-hidden width={48} height={48} className="bar-loading-ufo absolute top-0 left-0 size-12" />
		</span>
	);
}
