import Link from 'next/link';
import Icon from '@/components/atoms/Icon';

type BackLinkProps = {
	href?: string;
	label?: string;
	className?: string;
};

export default function BackLink({href = '/life', label = 'back', className = ''}: BackLinkProps) {
	return (
		<Link
			href={href}
			className={`inline-flex items-center gap-1.5 text-base lowercase tracking-wide text-black transition-all hover:opacity-70 ${className}`}>
			<Icon icon="lucide:arrow-left" className="h-4 w-4" />
			{label}
		</Link>
	);
}
