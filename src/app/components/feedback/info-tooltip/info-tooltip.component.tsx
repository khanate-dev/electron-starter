import { useState } from 'react';
import { ClickAwayListener, IconButton, Popper } from '@mui/material';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';

import { csx } from '~/app/helpers/style';
import { CustomTooltip } from '~/app/components/feedback/custom-tooltip';

import type { CustomTooltipProps } from '~/app/components/feedback/custom-tooltip';

export const InfoTooltip = ({
	sx,
	...props
}: Omit<CustomTooltipProps, 'children'>) => {
	const [open, setOpen] = useState(false);

	return (
		<CustomTooltip
			{...props}
			sx={csx({ textAlign: 'center' }, sx)}
			open={open}
			PopperComponent={(popperProps) => (
				<ClickAwayListener onClickAway={() => setOpen(false)}>
					<Popper {...popperProps} />
				</ClickAwayListener>
			)}
			disableFocusListener
			disableHoverListener
			disableTouchListener
			onClose={(event) => {
				event.stopPropagation();
				setOpen(false);
			}}
		>
			<IconButton
				sx={{ padding: 0 }}
				onClick={() => setOpen(!open)}
			>
				<InfoIcon color='info' />
			</IconButton>
		</CustomTooltip>
	);
};
