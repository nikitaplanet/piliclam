'use client';

import {useEffect} from 'react';
import type {LayoutProps} from 'sanity';

const STUDIO_STYLE_ID = 'studio-custom-styles';

const STUDIO_CSS = `
/* 可點元素 pointer */
button,
[type="button"],
[type="submit"],
[type="reset"],
[role="button"],
[data-ui="Button"],
[data-as="button"],
summary,
label[for],
a[href],
[data-ui="MenuButton"],
[data-ui="Tab"],
[data-ui="Switch"],
[data-ui="Checkbox"],
[data-ui="Radio"] {
  cursor: pointer !important;
}

button:disabled,
[aria-disabled="true"],
[data-disabled] {
  cursor: not-allowed !important;
}

/* 標題列／文件面板改回純白，移除象牙底 */
[data-testid="document-panel-header"],
[data-testid="document-panel"],
[data-testid="document-panel-scroller"],
[data-testid="document-view"],
[data-testid="document-header-title"] {
  background-color: #ffffff !important;
  --card-bg-color: #ffffff !important;
}

/* 文件表單加寬 + focus 邊框黑色 */
[data-testid="form-container"] {
  max-width: min(800px, 100%) !important;
  --card-focus-ring-color: #171717 !important;
  --input-border-color--focus: #171717 !important;
}

[data-testid="form-container"] [data-ui="TextInput"]:focus-within,
[data-testid="form-container"] [data-ui="TextArea"]:focus-within,
[data-testid="form-container"] [data-testid="pt-editor"]:focus-within,
[data-testid="form-container"] [data-testid="pt-editor"][data-focused],
[data-testid="form-container"] input:focus,
[data-testid="form-container"] textarea:focus {
  outline-color: #171717 !important;
  box-shadow: inset 0 0 0 1px #171717 !important;
  border-color: #171717 !important;
}

[data-testid="form-container"] .pt-editable,
[data-testid="form-container"] .pt-editable > .pt-block {
  max-width: min(800px, 100%) !important;
}
`;

function StudioStyles() {
	useEffect(() => {
		let style = document.getElementById(STUDIO_STYLE_ID) as HTMLStyleElement | null;
		if (!style) {
			style = document.createElement('style');
			style.id = STUDIO_STYLE_ID;
			document.head.appendChild(style);
		}
		style.textContent = STUDIO_CSS;

		return () => {
			style?.remove();
		};
	}, []);

	return null;
}

export default function StudioLayout(props: LayoutProps) {
	return (
		<>
			<StudioStyles />
			{props.renderDefault(props)}
		</>
	);
}
