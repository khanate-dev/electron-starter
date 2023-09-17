import {
	PlaylistAddRounded as AddIcon,
	PlayForWorkRounded as AssignIcon,
	ArrowBackRounded as BackIcon,
	HighlightOffRounded as CloseIcon,
	Percent as EfficiencyIcon,
	TrackChangesRounded as FormIcon,
	BackupRounded as ImportIcon,
	LocalShippingRounded as PostIcon,
	PrintRounded as PrintIcon,
	EditRounded as UpdateIcon,
	VisibilityRounded as ViewIcon,
} from '@mui/icons-material';
import { Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { CustomButton } from '~/app/components/controls/custom-button.component';
import { PAGE_HEADER_HEIGHT } from '~/app/constants';
import {
	csx,
	pageTransitionStyles,
	scrollStyles,
} from '~/app/helpers/style.helpers';
import { useDocTitle } from '~/app/hooks/doc-title.hook';
import { useUser } from '~/app/hooks/user.hook';
import { humanizeToken } from '~/shared/helpers/humanize-token.helpers';

import type { ReactNode } from 'react';
import type { To } from 'react-router-dom';
import type { FullButtonProps } from '~/app/components/controls/custom-button.component';
import type { UserType } from '~/app/schemas/user.schema';
import type { Mui } from '~/app/types/mui.types';
import type { Utils } from '~/shared/types/utils.types';

type Navigation = Utils.includeUnionKeys<
	{
		/** the label to show on the navigation action */
		label: string;

		/** the icon to show on the page */
		icon: JSX.Element;

		/** the user types with access to this navigation. Shows for all users if excluded */
		availableTo: UserType[];

		buttonProps?: Utils.prettify<
			Omit<
				FullButtonProps,
				'label' | 'icon' | 'isIcon' | 'isEndIcon' | 'buttonProps' | 'onClick'
			>
		>;
	} & ({ to: To } | { onClick: () => void })
>;

const defaults: Omit<Navigation, 'label' | 'icon'> = {
	availableTo: ['Administrator'],
};

const defaultNavigation = {
	view: { ...defaults, icon: <ViewIcon /> },
	add: { ...defaults, icon: <AddIcon /> },
	update: {
		...defaults,
		icon: <UpdateIcon />,
		buttonProps: { color: 'secondary' },
	},
	form: { ...defaults, icon: <FormIcon /> },
	assign: {
		...defaults,
		icon: <AssignIcon />,
		buttonProps: { color: 'secondary' },
	},
	back: {
		...defaults,
		icon: <BackIcon />,
		buttonProps: { color: 'error', variant: 'outlined' },
	},
	import: { ...defaults, icon: <ImportIcon /> },
	print: {
		...defaults,
		icon: <PrintIcon />,
		buttonProps: { variant: 'outlined' },
	},
	post: { ...defaults, icon: <PostIcon />, buttonProps: { color: 'error' } },
	close: { ...defaults, icon: <CloseIcon />, buttonProps: { color: 'error' } },
	'line-efficiency': {
		...defaults,
		icon: <EfficiencyIcon />,
		buttonProps: { variant: 'outlined' },
	},
} satisfies Record<string, Omit<Navigation, 'label' | 'to'>>;

type DefaultNavigation = keyof typeof defaultNavigation;

export type PageContainerProps = Mui.propsWithSx<{
	/** the title of the page */
	title: string;

	/** the navigation to show for the page */
	navigation?: (DefaultNavigation | Navigation)[];

	/** the page controls to render at the top */
	controls?: JSX.Element | JSX.Element[] | null;

	/** the status alert for the current page */
	status?: JSX.Element;

	children: ReactNode;
}>;

export const PageContainer = ({
	children,
	sx,
	title,
	navigation,
	controls,
	status,
}: PageContainerProps) => {
	const navigate = useNavigate();
	const { UserType } = useUser();

	useDocTitle(title);

	const filteredNav = (navigation ?? [])
		.map<Navigation>((row) => {
			if (typeof row === 'string') {
				return {
					...defaultNavigation[row],
					to: row === 'back' ? '-1' : row,
					onClick: undefined,
					label: humanizeToken(row),
				};
			}
			return row;
		})
		.filter((row) => row.availableTo.includes(UserType));

	return (
		<>
			<Stack
				direction='row'
				sx={{
					alignItems: 'center',
					height: PAGE_HEADER_HEIGHT,
					flexGrow: 0,
					flexShrink: 0,
					flexWrap: 'nowrap',
					padding: 0,
					gap: 1,
					marginBlock: 0,
					marginInline: 1,
					width: 'calc(100% - 20px)',
				}}
			>
				<Typography
					variant='h1'
					sx={{
						fontWeight: 'regular',
						textTransform: 'capitalize',
						whiteSpace: 'nowrap',
						fontSize: '2em',
						color: 'text.secondary',
						marginRight: 'auto',
					}}
				>
					{title}
				</Typography>

				{filteredNav.map(({ label, to, icon, onClick, buttonProps }, index) => {
					return (
						<CustomButton
							key={index}
							{...buttonProps}
							label={label}
							icon={icon}
							onClick={() => {
								if (to) to === '-1' ? navigate(-1) : navigate(to);
								else onClick?.();
							}}
						/>
					);
				})}
			</Stack>
			<Paper
				elevation={0}
				sx={csx(
					{
						flexGrow: 1,
						borderRadius: 1,
						margin: 1,
						marginTop: 0,
						padding: 2,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'stretch',
						borderWidth: 2,
						borderStyle: 'solid',
						borderColor: 'divider',
						position: 'relative',
						'& > .MuiAlert-root.showing': { marginBottom: 2 },
						...scrollStyles.y,
						...pageTransitionStyles,
					},
					sx,
				)}
			>
				{status}
				{controls && (
					<Stack
						direction='row'
						sx={{
							alignItems: 'center',
							gap: 1,
							flexWrap: 'wrap',
							marginBottom: 1,
							'> *': { flexGrow: 0, flexShrink: 0 },
							'& > .MuiAutocomplete-root': { minWidth: 200 },
						}}
					>
						{controls}
					</Stack>
				)}
				{children}
			</Paper>
		</>
	);
};
