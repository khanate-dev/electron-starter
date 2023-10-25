import { List, Stack } from '@mui/material';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { dashboardRoutes } from '~/dashboard.routes';
import { formatToken } from '~/helpers/format-token.helpers';
import { csx, scrollStyles } from '~/helpers/style.helpers';
import { useSidebar } from '~/hooks/sidebar.hook';
import { logout, useUser } from '~/hooks/user.hook';

import { SidebarGroup } from './sidebar-group.component';

import type { MouseEventHandler } from 'react';
import type { UserType } from '~/schemas/user.schema';
import type { Mui } from '~/types/mui.types';

const groups = [
	'order-generation',
	'cutting',
	'stitching',
	'machine',
	'smart-box-allocation',
	'quality',
	'planning',
	'settings',
] as const;

export type TSidebarGroup = (typeof groups)[number];

export type SidebarItemType = Mui.propsWithSx<{
	/** the identifier string */
	name: string;

	/** the sidebar group to put the item in */
	group: TSidebarGroup;

	/** the label to show on the list item */
	label?: string;

	/** if excluded, the item is used for page navigation */
	onClick?: MouseEventHandler<HTMLDivElement>;

	/** the user types that can access this page. available to everyone if excluded */
	availableTo?: UserType[];
}>;

const pages = dashboardRoutes.map<SidebarItemType>((route) => ({
	name: route.path,
	label: route.label,
	group: route.group,
	availableTo: route.availableTo,
}));

const width = { full: 200, minimized: 70 };

export const Sidebar = (props: Mui.propsWithSx) => {
	const { pathname } = useLocation();

	const { UserType } = useUser();
	const { size, isMinimized } = useSidebar();

	const activeGroup = groups.find((group) => {
		const items = pages.filter((item) => item.group === group);
		return items.some((item) =>
			new RegExp(`/${formatToken(item.name, 'kebab')}(/.*)?$`, 'iu').test(
				pathname,
			),
		);
	});

	const [defaultActiveGroup] = useState(activeGroup);

	const appControls: SidebarItemType[] = [
		{
			name: 'logout',
			label: 'Logout',
			sx: { color: 'error.main', '& svg': { color: 'error.main' } },
			onClick: logout,
			group: 'settings',
		},
	];

	const navigationList: SidebarItemType[] = [...pages, ...appControls];

	const availableNavigation = navigationList.filter(
		(page) => !page.availableTo || page.availableTo.includes(UserType),
	);

	const topNavigation = availableNavigation.filter(
		(item) => item.group !== 'settings',
	);
	const bottomNavigation = availableNavigation.filter(
		(item) => item.group === 'settings',
	);

	const groupsSansBottom = groups.filter((group) => group !== 'settings');

	return (
		<Stack
			component='aside'
			sx={csx(
				{
					width: width[size],
					height: '100%',
					whiteSpace: 'nowrap',
					backgroundColor: 'background.paper',
					position: 'relative',
					borderRightWidth: 2,
					borderRightStyle: 'solid',
					borderRightColor: 'divider',
					transition: (theme) => theme.transitions.create('width'),
				},
				props.sx,
			)}
		>
			<Stack
				component={List}
				sx={{ flex: 1, overflow: 'hidden', paddingBlock: 0.5 }}
			>
				<Stack
					flex={1}
					gap={0.5}
					sx={scrollStyles.y}
				>
					{groupsSansBottom.map((group) => (
						<SidebarGroup
							key={group}
							group={group}
							items={topNavigation.filter((item) => item.group === group)}
							isMinimized={isMinimized}
							isActive={activeGroup === group}
							defaultExpanded={defaultActiveGroup === group}
						/>
					))}
				</Stack>
				<SidebarGroup
					group='settings'
					items={bottomNavigation}
					isMinimized={isMinimized}
					isActive={activeGroup === 'settings'}
					defaultExpanded={defaultActiveGroup === 'settings'}
					sx={{
						'& .MuiAccordionSummary-expandIconWrapper': {
							transform: 'rotate(180deg)',
							'&.Mui-expanded': { transform: 'none' },
						},
					}}
				/>
			</Stack>
		</Stack>
	);
};
