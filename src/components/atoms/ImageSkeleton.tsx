type ImageSkeletonProps = {
	className?: string;
};

export default function ImageSkeleton({className = ''}: ImageSkeletonProps) {
	return <span aria-hidden className={`image-skeleton absolute inset-0 block ${className}`} />;
}
