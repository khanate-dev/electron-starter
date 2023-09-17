import { ExpandMoreRounded as ExpandIcon } from '@mui/icons-material';
import {
	Accordion,
	AccordionSummary,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@mui/material';

import { CustomTooltip } from '~/app/components/feedback/custom-tooltip.component';
import { AppIcon } from '~/app/components/media/app-icon.component';
import { AppLink } from '~/app/components/navigation/app-link.component';
import { SIDEBAR_GROUPS_LABELS } from '~/app/constants';
import {
	csx,
	getOppositeColor,
	wrappedTextStyle,
} from '~/app/helpers/style.helpers';
import { humanizeToken } from '~/shared/helpers/humanize-token.helpers';

import type {
	SidebarItemType,
	TSidebarGroup,
} from '~/app/components/panels/sidebar.component';
import type { Mui } from '~/app/types/mui.types';

export type SidebarGroupProps = Mui.propsWithSx<{
	/** the name of the group */
	group: TSidebarGroup;

	/** the items in the current sidebar group */
	items: SidebarItemType[];

	/** is the sidebar minimized? */
	isMinimized: boolean;

	/** is one of the group's item the currently active page? */
	isActive: boolean;

	/** should the group's accordion be expanded by default? */
	defaultExpanded?: boolean;
}>;

export const SidebarGroup = ({
	sx,
	group,
	items,
	isMinimized,
	isActive,
	defaultExpanded,
}: SidebarGroupProps) => {
	const groupLabel = SIDEBAR_GROUPS_LABELS[group] ?? humanizeToken(group);

	return (
		<Accordion
			key={group}
			defaultExpanded={defaultExpanded}
			elevation={0}
			sx={csx(
				{
					marginInline: 0.5,
					marginBlock: 0,
					borderRadius: 1,
					borderWidth: 2,
					borderStyle: 'solid',
					borderColor: isActive ? 'text.secondary' : 'divider',
					'&.Mui-expanded': { marginInline: 0.5, marginBlock: 0 },
					'&::before': { display: 'none' },
				},
				sx,
			)}
			square
		>
			<CustomTooltip
				title={groupLabel}
				placement='right'
				disabled={!isMinimized}
			>
				<AccordionSummary
					expandIcon={<ExpandIcon />}
					sx={{
						transition: (theme) =>
							theme.transitions.create(['background-color']),
						height: 40,
						minHeight: 'unset !important',
						paddingInline: 0.5,
						borderRadius: 0.75,
						'&:hover': { backgroundColor: 'divider' },
						'& > .MuiAccordionSummary-content': {
							margin: 0,
							color: getOppositeColor,
							height: '100%',
							display: 'flex',
							gap: 1,
							alignItems: 'center',
							overflow: 'hidden',
						},
					}}
				>
					<AppIcon
						name={group}
						iconProps={{ sx: { flexShrink: 0 } }}
					/>
					<Typography
						sx={{
							fontWeight: 'medium',
							fontSize: '1em',
							flexBasis: isMinimized ? 0 : '100%',
							transition: (theme) => theme.transitions.create('flex-basis'),
							...wrappedTextStyle,
						}}
					>
						{groupLabel}
					</Typography>
				</AccordionSummary>
			</CustomTooltip>

			{items.map((item) => {
				const itemLabel = item.label ?? humanizeToken(item.name);
				const button = (
					<ListItemButton
						sx={csx(
							{
								color: 'text.primary',
								position: 'relative',
								paddingInlineStart: 1.5,
								paddingInlineEnd: 1,
								'&::before': {
									content: '""',
									display: 'block',
									position: 'absolute',
									top: '20%',
									left: 0,
									height: '60%',
									width: 0,
									borderTopRightRadius: 5,
									borderBottomRightRadius: 5,
									backgroundColor: 'primary.main',
									transition: (theme) => theme.transitions.create('width'),
								},
								'& .MuiTypography-root': {
									transition: (theme) =>
										theme.transitions.create('font-weight'),
								},
								'.active > &': {
									color: getOppositeColor,
									'& svg': { color: getOppositeColor },
									'&::before': { width: 7 },
									'& .MuiTypography-root': { fontWeight: 'medium' },
								},
							},
							item.sx,
						)}
						onClick={item.onClick}
					>
						<ListItemIcon
							sx={{
								transition: (theme) => theme.transitions.create('width'),
								minWidth: 'unset',
								width: 25,
								marginRight: 1,
								justifyContent: 'center',
								color: 'text.secondary',
							}}
						>
							<AppIcon name={item.name as never} />
						</ListItemIcon>

						<ListItemText
							primary={itemLabel}
							primaryTypographyProps={{ variant: 'body2' }}
							sx={{
								textTransform: 'capitalize',
								overflow: 'hidden',
								'& > p': {
									fontWeight: 'medium',
									color: 'text.secondary',
									...wrappedTextStyle,
								},
							}}
						/>
					</ListItemButton>
				);

				return (
					<CustomTooltip
						key={item.name}
						title={itemLabel}
						placement='right'
						disabled={!isMinimized}
					>
						{!item.onClick ? (
							<AppLink
								to={item.name}
								label={button}
							/>
						) : (
							button
						)}
					</CustomTooltip>
				);
			})}
		</Accordion>
	);
};
