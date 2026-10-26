type DotLoadingProps = {
	label?: string;
};

export default function DotLoading({label = '載入中'}: DotLoadingProps) {
	return (
		<div className="flex items-center justify-center py-20 text-gray-400" role="status" aria-live="polite" aria-label={label}>
			<span className="sr-only">{label}</span>
			<span className="flex gap-1.5" aria-hidden="true">
				<span className="dot-loading-dot size-2 rounded-full bg-current" />
				<span className="dot-loading-dot size-2 rounded-full bg-current" />
				<span className="dot-loading-dot size-2 rounded-full bg-current" />
			</span>
		</div>
	);
}
