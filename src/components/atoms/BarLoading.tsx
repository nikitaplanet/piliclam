type BarLoadingProps = {
	className?: string;
	label?: string;
};

/** lightbox／深色底用：置中白色長條 shimmer */
export default function BarLoading({className = '', label = '載入中'}: BarLoadingProps) {
	return (
		<span role="status" aria-live="polite" aria-label={label} className={`pointer-events-none flex items-center justify-center ${className}`}>
			<span className="sr-only">{label}</span>
			<span aria-hidden className="bar-loading block h-0.5 w-24" />
		</span>
	);
}
