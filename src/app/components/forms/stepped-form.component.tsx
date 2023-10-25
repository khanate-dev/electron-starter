import {
	ArrowBack as BackIcon,
	ArrowForward as ForwardIcon,
} from '@mui/icons-material';
import { Divider, Stack, Step, StepLabel, Stepper } from '@mui/material';

import { CustomButton } from '../controls/custom-button.component';
import {
	pageTransitionStyles,
	scrollStyles,
} from '../../helpers/style.helpers';

import type { Utils } from '../../../shared/types/utils.types';

export type SteppedFormProps<
	Steps extends Readonly<string[]>,
	Children = Utils.tuple<Steps['length'], JSX.Element>,
> = {
	children: Children;

	/** the label for the steps */
	steps: Steps;

	/** the index of the current step of the form */
	active: Steps[number];

	/** the function to call when the back button is clicked? The back button will not be rendered if this property is excluded */
	onBack?: () => void;

	/** the function to call when the next button is clicked? The next button will not be rendered if this property is excluded */
	onNext?: () => void;
};

export const SteppedForm = <Steps extends Readonly<string[]>>({
	children,
	steps,
	active,
	onBack,
	onNext,
}: SteppedFormProps<Steps>) => {
	const index = steps.indexOf(active);
	const activeStep = children[index] ?? children[0];

	if (!activeStep) return null;

	return (
		<Stack
			sx={{
				flexGrow: 0,
				flexShrink: 0,
				gap: 1,
				overflow: 'hidden',
			}}
		>
			<Stack
				sx={{
					gap: 3,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexWrap: 'nowrap',
					overflow: 'hidden',
					flexShrink: 0,
				}}
			>
				{onBack && index > 0 && (
					<CustomButton
						sx={{ flexShrink: 0 }}
						color='primary'
						label='Back'
						icon={<BackIcon />}
						onClick={onBack}
					/>
				)}

				<Stepper
					activeStep={index}
					sx={{
						flexGrow: 1,
						flexShrink: 1,
						paddingBlock: 2,
						...scrollStyles.x,
					}}
				>
					{children.map((_step, idx) => (
						<Step key={idx}>
							<StepLabel
								sx={{
									fontSize: '0.9em',
									fontWeight: 'medium',
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'ellipses',
									'& .MuiSvgIcon-root': {
										fontSize: '2em',
										fontWeight: 'bold',
									},
								}}
							>
								{steps[idx] ?? `Step ${idx + 1}`}
							</StepLabel>
						</Step>
					))}
				</Stepper>

				{onNext && index + 1 < children.length && (
					<CustomButton
						sx={{ flexShrink: 0 }}
						color='primary'
						label='Next'
						icon={<ForwardIcon />}
						isEndIcon
						onClick={onNext}
					/>
				)}
			</Stack>

			<Divider />

			<Stack sx={{ flex: 1, ...pageTransitionStyles, ...scrollStyles.y }}>
				{activeStep}
			</Stack>
		</Stack>
	);
};
