import { useNavigate } from 'react-router-dom';
import { Paper, Stack, Typography } from '@mui/material';
import {
	BackupRounded as ImportIcon,
	VisibilityRounded as ViewIcon,
	PlayForWorkRounded as AssignIcon,
	PlaylistAddRounded as AddIcon,
	PrintRounded as PrintIcon,
	TrackChangesRounded as FormIcon,
	EditRounded as UpdateIcon,
	SyncRounded as SyncIcon,
	DoneAll as ActivateIcon,
	ArrowBackRounded as BackIcon,
	LocalShippingRounded as PostIcon,
} from '@mui/icons-material';

import { csx } from '~/app/helpers/style';
import { CustomButton } from '~/app/components/controls/custom-button';
import { useUser } from '~/app/contexts/user';

import { pageContainerStyles as styles } from './page-container.styles';

import type { UserType } from '~/app/schemas/user';
import type { FullButtonProps } from '~/app/components/controls/custom-button';

const navigationPages = [
	'import',
	'view',
	'assign',
	'add',
	'print',
	'form',
	'update',
	'sync',
	'activate',
	'post',
	'back',
] as const;

type NavigationPage = (typeof navigationPages)[number];

type Navigation = {
	/** the label to show on the navigation action */
	label?: string;

	/** the user types with access to this navigation. Shows for all users if excluded */
	availableTo: UserType[];
} & Omit<FullButtonProps, 'label'>;

export type PageContainerProps = {
	children: React.Node;

	/** the styles to apply to the body container */
	sx?: Mui.SxStyle;

	/** the title of the page */
	title: string;

	/** the navigation to show for the page */
	navigation?: NavigationPage[];

	/** the page controls to render at the top */
	controls?: JSX.Element | JSX.Element[] | null;
};

const icons: Record<NavigationPage, JSX.Element> = {
	import: <ImportIcon />,
	view: <ViewIcon />,
	assign: <AssignIcon />,
	add: <AddIcon />,
	print: <PrintIcon />,
	form: <FormIcon />,
	update: <UpdateIcon />,
	sync: <SyncIcon />,
	activate: <ActivateIcon />,
	post: <PostIcon />,
	back: <BackIcon />,
};

type NavigationDetails = Record<NavigationPage, Navigation>;

const navigationDetails: NavigationDetails = {
	import: {
		availableTo: ['Administrator'],
	},
	view: {
		availableTo: ['Administrator'],
	},
	assign: {
		availableTo: ['Administrator'],
		color: 'secondary',
		variant: 'outlined',
	},
	add: {
		availableTo: ['Administrator'],
	},
	print: {
		availableTo: ['Administrator', 'Supervisor'],
		variant: 'outlined',
	},
	form: {
		availableTo: ['Administrator'],
	},
	update: {
		availableTo: ['Administrator', 'Supervisor'],
		color: 'secondary',
	},
	sync: {
		availableTo: ['Administrator'],
		color: 'secondary',
	},
	activate: {
		availableTo: ['Administrator'],
		color: 'secondary',
	},
	post: {
		availableTo: ['Administrator'],
		color: 'error',
	},
	back: {
		availableTo: ['Administrator'],
		color: 'error',
		variant: 'outlined',
	},
};

type NavArray = ({ id: NavigationPage } & Omit<Navigation, 'availableTo'>)[];

export const PageContainer = ({
	children,
	sx,
	title,
	navigation: navigationIds,
	controls,
}: PageContainerProps) => {
	const navigate = useNavigate();
	const { userType } = useUser();

	const navigation = (navigationIds ?? []).reduce<NavArray>((array, id) => {
		const { availableTo, ...props } = navigationDetails[id];
		if (!availableTo.includes(userType)) return array;

		return [...array, { id, ...props }];
	}, []);

	return (
		<>
			<Stack
				direction='row'
				sx={styles.header}
			>
				<Typography
					sx={styles.title}
					variant='h1'
				>
					{title}
				</Typography>

				{navigation.map(({ id, label, ...props }) => {
					return (
						<CustomButton
							key={id}
							{...props}
							label={label ?? id}
							icon={icons[id]}
							onClick={() => {
								return id === 'back' ? navigate(-1) : navigate(id);
							}}
						/>
					);
				})}
			</Stack>
			<Paper
				className='scroll-y'
				sx={csx(styles.pageBody, sx)}
				elevation={0}
			>
				{controls && (
					<Stack
						direction='row'
						sx={styles.controls}
					>
						{controls}
					</Stack>
				)}
				{children}
			</Paper>
		</>
	);
};
