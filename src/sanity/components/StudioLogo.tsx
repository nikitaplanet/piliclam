import {brandName} from '@/theme/brand';

export default function StudioLogo() {
	return (
		<span
			style={{
				fontWeight: 700,
				letterSpacing: '0.05em',
				textTransform: 'uppercase',
				fontSize: '0.95rem',
			}}>
			{brandName}
		</span>
	);
}
