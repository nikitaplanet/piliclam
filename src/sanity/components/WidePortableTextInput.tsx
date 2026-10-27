'use client';

import type {ArrayOfObjectsInputProps, PortableTextInputProps} from 'sanity';
import styled from 'styled-components';

/**
 * 加寬內文編輯區，並讓高度隨內容成長（由文件面板外層滾動，
 * 避免一直在 PTE 內層小視窗裡滾）。
 */
const Root = styled.div`
	width: 100%;

	[data-testid='pt-editor'][data-fullscreen='false'] {
		min-height: 70vh;
		height: auto !important;
	}

	[data-testid='pt-editor'] [data-ui='ScrollContainer'],
	[data-testid='pt-editor'] [data-testid='scroll-container'],
	[data-testid='pt-editor'] [data-testid='pt-editor-scroll'],
	[data-testid='pt-editor'] .pt-editable {
		overflow: visible !important;
		max-height: none !important;
		height: auto !important;
		min-height: 60vh;
	}

	[data-testid='pt-editor'],
	[data-testid='pt-editor'] .pt-editable,
	[data-testid='pt-editor'] .pt-editable > .pt-block {
		max-width: min(800px, 100%) !important;
		width: 100% !important;
	}
`;

export function WidePortableTextInput(props: ArrayOfObjectsInputProps) {
	const ptProps = props as unknown as PortableTextInputProps;

	return (
		<Root>
			{ptProps.renderDefault({
				...ptProps,
				initialActive: true,
			})}
		</Root>
	);
}
