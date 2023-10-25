import { Drawer, IconButton, List, Stack, keyframes } from '@mui/material';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { SidebarGroup } from './sidebar-group.component';

import { CustomButton } from '../controls/custom-button.component';
import { AppIcon } from '../media/app-icon.component';
import { AppLogo } from '../media/app-logo.component';
import { AppLink } from '../navigation/app-link.component';
import {
	APP_HEADER_HEIGHT,
	DRAWER_MINIMIZED_WIDTH,
	DRAWER_WIDTH,
	SIDEBAR_GROUPS,
} from '../../constants';
import { dashboardRoutes } from '../../dashboard.routes';
import { formatToken } from '../../helpers/format-token.helpers';
import { scrollStyles } from '../../helpers/style.helpers';
import { logout, useUser } from '../../hooks/user.hook';

import type { MouseEventHandler } from 'react';
import type { UserType } from '../../schemas/user.schema';
import type { Mui } from '../../types/mui.types';

export type TSidebarGroup = (typeof SIDEBAR_GROUPS)[number];

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

export const Sidebar = () => {
	const { UserType } = useUser();
	const { pathname } = useLocation();

	const activeGroup = SIDEBAR_GROUPS.find((group) => {
		const items = pages.filter((item) => item.group === group);
		return items.some((item) =>
			new RegExp(`/${formatToken(item.name, 'kebab')}(/.*)?$`, 'iu').test(
				pathname,
			),
		);
	});

	const [isMinimized, setIsMinimized] = useState<boolean>(false);
	const [defaultActiveGroup] = useState(activeGroup);

	const appControls: SidebarItemType[] = [
		{
			name: 'logout',
			label: 'Logout',
			sx: { color: 'error.main', '& svg': { color: 'error.main' } },
			onClick: logout,
			group: 'bottom',
		},
	];

	const navigationList: SidebarItemType[] = [...pages, ...appControls];

	const availableNavigation = navigationList.filter(
		(page) => !page.availableTo || page.availableTo.includes(UserType),
	);

	const topNavigation = availableNavigation.filter(
		(item) => item.group !== 'bottom',
	);
	const bottomNavigation = availableNavigation.filter(
		(item) => item.group === 'bottom',
	);

	const groupsSansBottom = SIDEBAR_GROUPS.filter((group) => group !== 'bottom');

	return (
		<Drawer
			variant='permanent'
			sx={{
				zIndex: (theme) => theme.zIndex.drawer + 2,
				width: isMinimized ? DRAWER_MINIMIZED_WIDTH : DRAWER_WIDTH,
				height: '100vh',
				flexShrink: 0,
				whiteSpace: 'nowrap',
				backgroundColor: 'background.paper',
				position: 'relative',
				transition: (theme) => theme.transitions.create('width'),
				'& > .MuiDrawer-paper': {
					transition: (theme) => theme.transitions.create('width'),
					overflow: 'unset',
					width: isMinimized ? DRAWER_MINIMIZED_WIDTH : DRAWER_WIDTH,
					height: '100%',
					borderRightWidth: 2,
				},
				'& .MuiListItemIcon-root': {
					width: isMinimized ? '100%' : undefined,
				},
			}}
		>
			<AppLink to=''>
				<CustomButton
					icon={<AppLogo isIcon={isMinimized} />}
					label='Home'
					tooltip={isMinimized ? { placement: 'right' } : false}
					sx={{
						borderRadius: 0,
						width: '100%',
						height: APP_HEADER_HEIGHT - 2,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexShrink: 0,
						'& svg': {
							width: '85%',
							height: '85%',
							animationDuration: (theme) =>
								`${theme.transitions.duration.shortest}ms`,
							animationTimingFunction: (theme) =>
								theme.transitions.easing.sharp,
							animationName: keyframes({ from: { opacity: 0 } }).toString(),
						},
					}}
					isIcon
				/>
			</AppLink>

			<IconButton
				sx={{
					position: 'absolute',
					top: 0,
					right: -APP_HEADER_HEIGHT,
					width: APP_HEADER_HEIGHT,
					height: 'auto',
					padding: '20px',
					aspectRatio: '1',
					borderRadius: 0,
					'& > svg': {
						transform: `rotateY(${isMinimized ? 0 : 180}deg)`,
						transition: (theme) => theme.transitions.create('transform'),
					},
				}}
				onClick={() => {
					setIsMinimized((prev) => !prev);
				}}
			>
				<AppIcon name='toggle-sidebar' />
			</IconButton>

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
					group='bottom'
					items={bottomNavigation}
					isMinimized={isMinimized}
					isActive={activeGroup === 'bottom'}
					defaultExpanded={defaultActiveGroup === 'bottom'}
					sx={{
						'& .MuiAccordionSummary-expandIconWrapper': {
							transform: 'rotate(180deg)',
							'&.Mui-expanded': { transform: 'none' },
						},
					}}
				/>
			</Stack>
		</Drawer>
	);
};
