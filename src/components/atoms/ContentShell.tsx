import type {ReactNode} from 'react';

export default function ContentShell({children}: {children: ReactNode}) {
	return <div className="mx-auto max-w-[1000px] px-5 pb-10 md:px-10">{children}</div>;
}
