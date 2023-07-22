import {
	ToggleButton as MuiToggleButton,
	ToggleButtonGroup,
} from '@mui/material';

import { humanizeToken } from '~/shared/helpers/string';

import type {
	ToggleButtonProps as MuiToggleButtonProps,
	ToggleButtonGroupProps,
} from '@mui/material';
import type { MouseEvent } from 'react';

export type ToggleButtonObjectOption<Values extends string> =
	MuiToggleButtonProps & {
		label: string;
		value: Values;
	};

export type ToggleButtonProps<
	Values extends string,
	Options extends Readonly<Values[] | ToggleButtonObjectOption<Values>[]>,
> = {
	/** the options for the  */
	options: Options;

	/** the currently selected option */
	value: null | Values;

	/** the function to call when the selected option changes */
	onChange: (value: Values, event: MouseEvent<HTMLElement>) => void;
} & Omit<ToggleButtonGroupProps, 'onChange' | 'value'>;

export const ToggleButton = <
	Values extends string,
	Options extends Readonly<Values[] | ToggleButtonObjectOption<Values>[]>,
>({
	options: passedOptions,
	value,
	onChange,
	...groupProps
}: ToggleButtonProps<Values, Options>) => {
	return (
		<ToggleButtonGroup
			{...groupProps}
			value={value}
			exclusive={groupProps.exclusive ?? true}
			color={groupProps.color ?? 'primary'}
			onChange={(event, newValue) => {
				onChange(newValue as Values, event);
			}}
		>
			{passedOptions.map((passedOption) => {
				let label: string;
				let currValue: string;
				let props = {};
				if (typeof passedOption === 'object') {
					const { label: l, value: v, ...p } = passedOption;
					label = l;
					currValue = v;
					props = p;
				} else {
					label = humanizeToken(passedOption);
					currValue = passedOption;
				}
				return (
					<MuiToggleButton
						{...props}
						key={currValue}
						value={currValue}
					>
						{label}
					</MuiToggleButton>
				);
			})}
		</ToggleButtonGroup>
	);
};
