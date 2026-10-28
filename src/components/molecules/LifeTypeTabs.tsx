'use client';

import Link from 'next/link';
import {lifeListHref, type LifeEntryType} from '@/lib/lifeEntry';

const tabs: {type: LifeEntryType; label: string}[] = [
	{type: 'blog', label: 'blog'},
	{type: 'gallery', label: 'gallery'},
];

type LifeTypeTabsProps = {
	active: LifeEntryType;
};

export default function LifeTypeTabs({active}: LifeTypeTabsProps) {
	return (
		<nav aria-label="Life 類型" className="flex flex-row gap-6 md:flex-col md:gap-3">
			{tabs.map(({type, label}) => {
				const isActive = active === type;
				return (
					<Link
						key={type}
						href={lifeListHref(type)}
						scroll={false}
						className={`text-lg lowercase transition-colors ${
							isActive ? 'font-bold text-primary' : 'text-black hover:font-bold hover:text-primary'
						}`}
						aria-current={isActive ? 'page' : undefined}>
						{label}
					</Link>
				);
			})}
		</nav>
	);
}
