import { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { ExpandMoreRounded as ExpandIcon } from '@mui/icons-material';

import { csx } from '~/app/helpers/style';
import { CustomButton } from '~/app/components/controls/custom-button';

import type { AccordionProps } from '@mui/material';
import type { FullButtonProps } from '~/app/components/controls/custom-button';

export type SimpleAccordionProps = {
	/** the title to show in the accordion summary */
	title: React.Node;

	/** the subtitle to show in the accordion summary */
	subtitle?: React.Node;

	/** the actions to show on the accordion header */
	actions?: FullButtonProps[];

	/** the contents to render in the accordion details */
	children: React.Node;

	/** the styles to apply to the accordion children */
	styles?: {
		accordion?: Mui.SxStyle;
		summary?: Mui.SxStyle;
		details?: Mui.SxStyle;
	};
} & Pick<
	AccordionProps,
	| 'sx'
	| 'disabled'
	| 'defaultExpanded'
	| 'disableGutters'
	| 'square'
	| 'expanded'
	| 'onChange'
>;

export const SimpleAccordion = ({
	expanded: passedExpanded,
	onChange,
	title,
	subtitle,
	actions,
	children,
	styles: passedStyles,
	...accordionProps
}: SimpleAccordionProps) => {
	const [localExpanded, setLocalExpanded] = useState(
		passedExpanded ?? accordionProps.defaultExpanded ?? false
	);

	const expanded = passedExpanded ?? localExpanded;

	return (
		<Accordion
			{...accordionProps}
			expanded={accordionProps.disabled ? false : expanded}
			sx={csx(
				{
					borderRadius: 1,
					borderWidth: 1,
					borderStyle: 'solid',
					borderColor: 'divider',
					'&::before': {
						content: 'unset',
					},
					color: 'text.secondary',
					'&.Mui-expanded': {
						margin: 0,
						'& .MuiAccordionSummary-content': {
							marginBlock: 1,
						},
					},
				},
				passedStyles?.accordion,
				accordionProps.sx
			)}
		>
			<AccordionSummary
				expandIcon={<ExpandIcon />}
				sx={csx(
					{
						textTransform: 'capitalize',
						fontWeight: 'medium',
						minHeight: 48,
						'& > .MuiAccordionSummary-content': {
							alignItems: 'center',
							gap: 2,
							marginBlock: 1,
							'& > .MuiButton-root': {
								minWidth: 100,
							},
						},
					},
					passedStyles?.summary
				)}
				onClick={(event) =>
					onChange?.(event, expanded) ?? setLocalExpanded((prev) => !prev)
				}
			>
				{title}
				{subtitle}
				{actions?.map(({ onClick, ...action }, index) => (
					<CustomButton
						key={index}
						{...action}
						onClick={(event) => {
							event.stopPropagation();
							onClick?.(event);
						}}
					/>
				))}
			</AccordionSummary>

			<AccordionDetails sx={passedStyles?.details}>{children}</AccordionDetails>
		</Accordion>
	);
};
