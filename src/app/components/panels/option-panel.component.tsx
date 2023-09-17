import {
	ArrowLeft,
	ArrowRight,
	Add as MaximizeIcon,
	Remove as MinimizeIcon,
} from '@mui/icons-material';
import {
	Divider,
	IconButton,
	List,
	ListItemButton,
	Pagination as MuiPagination,
	Stack,
	Typography,
	alpha,
	useTheme,
} from '@mui/material';
import { useState } from 'react';

import { Dropzone } from '~/app/components/controls/dropzone.component';
import {
	csx,
	getOppositeColor,
	scrollStyles,
} from '~/app/helpers/style.helpers';
import { useFiltering } from '~/app/hooks/filtering.hook';
import { usePagination } from '~/app/hooks/pagination.hook';
import { humanizeToken } from '~/shared/helpers/humanize-token.helpers';

import type { ReactNode } from 'react';
import type { Mui } from '~/app/types/mui.types';

export type OptionPanelProps<T extends Obj> = {
	/** the styles to apply to the panel components */
	styles?: {
		container?: Mui.sxProp;
		panel?: Mui.sxProp;
		dropzone?: Mui.sxProp;
	};

	/** the list of items to show */
	data: T[];

	/** the list of schema field names to show on option */
	labelBy: (keyof T)[] | { key: keyof T; label: string }[];

	/** the function to call when a panel item is picked */
	onPick: (item: T) => void;

	children: ReactNode;
};

export const OptionPanel = <T extends Obj>({
	styles,
	labelBy,
	data,
	onPick,
	children,
}: OptionPanelProps<T>) => {
	const { palette, transitions } = useTheme();

	const [isMinimized, setIsMinimized] = useState(false);
	const [hideControls, setHideControls] = useState(false);

	const keys = labelBy.map((row) => {
		if (typeof row === 'object') return row;
		return { key: row, label: humanizeToken(String(row)) };
	});

	const buttonStyle = {
		backgroundColor: alpha(palette.primary[palette.mode], 0.3),
		borderWidth: 2,
		borderStyle: 'solid',
		borderColor: (theme) => `primary.${theme.palette.mode}`,
		borderRadius: 1,
		color: getOppositeColor,
		transition: (theme) =>
			theme.transitions.create(['border', 'background-color']),
		'&:hover': {
			backgroundColor: alpha(palette.primary[palette.mode], 0.6),
			borderColor: 'primary.main',
		},
		'&:focus-visible': {
			backgroundColor: alpha(palette.primary[palette.mode], 0.7),
			borderColor: getOppositeColor,
		},
	} satisfies Mui.sxStyle;

	const { filteredData, filterJsx } = useFiltering({
		data,
		columns: keys.map(({ key }) => key),
		noStatus: true,
	});

	const {
		currentPage,
		setCurrentPage,
		totalPages,
		paginatedData: paginatedList,
	} = usePagination(filteredData);

	return (
		<Stack
			sx={csx({ flex: 1, gap: 1 }, styles?.container)}
			direction='row'
		>
			<Stack
				sx={csx(
					{
						width: isMinimized ? 50 : 250,
						flexShrink: 0,
						alignItems: 'center',
						gap: 1,
						backgroundColor: 'background.default',
						borderWidth: 2,
						borderStyle: 'solid',
						borderColor: 'divider',
						borderRadius: 1,
						padding: 1,
						transition: transitions.create('width'),
						position: 'relative',
						'> :not(button)': {
							transition: transitions.create(['width', 'height']),
							width: '100%',
						},
					},
					isMinimized && {
						'> :not(button:first-of-type)': {
							width: '0',
							'&.MuiButtonBase-root': {
								borderWidth: 0,
								'&::before, &::after': {
									width: 0,
								},
							},
						},
					},
					styles?.panel,
				)}
			>
				<IconButton
					color='primary'
					size='large'
					sx={[buttonStyle, { width: 30, aspectRatio: '1' }]}
					onClick={() => {
						setIsMinimized((prev) => !prev);
					}}
				>
					{isMinimized ? (
						<ArrowRight fontSize='large' />
					) : (
						<ArrowLeft fontSize='large' />
					)}
				</IconButton>

				<Stack
					sx={{
						flexShrink: 0,
						gap: 1,
						overflow: 'hidden',
						height: hideControls ? 0 : totalPages === 1 ? 50 : 80,
					}}
				>
					{filterJsx}

					{totalPages > 1 && (
						<MuiPagination
							count={totalPages}
							siblingCount={1}
							page={currentPage}
							variant='outlined'
							color='primary'
							shape='rounded'
							size='small'
							sx={{
								'&  ul': {
									flexWrap: 'nowrap',
									justifyContent: 'center',
									gap: 0.5,
								},
							}}
							hideNextButton
							hidePrevButton
							onChange={(_event, page) => {
								setCurrentPage(page);
							}}
						/>
					)}
				</Stack>

				<Divider sx={{ overflow: 'hidden' }}>
					<IconButton
						sx={[
							buttonStyle,
							{
								width: 20,
								padding: 0,
								borderRadius: 0.5,
								'& svg': { width: '100%', height: '100%' },
							},
						]}
						disableRipple
						onClick={() => {
							setHideControls((prev) => !prev);
						}}
					>
						{hideControls ? <MaximizeIcon /> : <MinimizeIcon />}
					</IconButton>
				</Divider>

				<Stack
					component={List}
					sx={{ gap: 1, padding: 0, marginTop: 0.5, ...scrollStyles.y }}
				>
					{paginatedList.map((row, index) => {
						const content = keys.map(({ key, label }) => (
							<Stack
								key={String(key)}
								direction='row'
								sx={{ alignItems: 'center', gap: 1, width: 1 }}
							>
								<Typography
									sx={{
										paddingInline: 1,
										backgroundColor: alpha(palette.primary.main, 0.2),
										fontWeight: 'medium',
										borderRadius: 0.5,
										flexShrink: 0,
									}}
								>
									{label}
								</Typography>
								<Typography
									flex={1}
									noWrap
								>
									{String(row[key])}
								</Typography>
							</Stack>
						));

						return (
							<ListItemButton
								key={index}
								draggable={true}
								sx={{
									cursor: 'grab',
									flexDirection: 'column',
									padding: 0.5,
									gap: 0.5,
									...buttonStyle,
								}}
								onClick={() => {
									onPick(row);
								}}
								onDragStart={(event) => {
									event.dataTransfer.setData(
										'index',
										String(data.indexOf(row)),
									);
								}}
							>
								{content}
							</ListItemButton>
						);
					})}
				</Stack>
			</Stack>

			<Dropzone
				sx={csx({ flex: 1, overflow: 'hidden' }, styles?.dropzone)}
				onDrop={(dataTransfer) => {
					const index = parseInt(dataTransfer.getData('index'));
					const operation = data[index];
					if (!operation) return;
					onPick(operation);
				}}
			>
				{children}
			</Dropzone>
		</Stack>
	);
};
