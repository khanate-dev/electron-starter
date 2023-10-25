import {
	ToggleButton as MuiToggleButton,
	ToggleButtonGroup,
} from '@mui/material';

import { humanizeToken } from '../../helpers/humanize-token.helpers';
import { omit } from '../../helpers/object.helpers';

import type {
	ToggleButtonProps as MuiToggleButtonProps,
	ToggleButtonGroupProps,
} from '@mui/material';
import type { MouseEvent } from 'react';
import type { Utils } from '../../../shared/types/utils.types';

export type ToggleButtonObjectOption<Value extends string> = Utils.prettify<
	MuiToggleButtonProps & {
		label: string;
		value: Value;
	}
>;

export type ToggleButtonProps<
	Value extends string,
	Options extends Readonly<Value[] | ToggleButtonObjectOption<Value>[]>,
> = Omit<ToggleButtonGroupProps, 'onChange' | 'value'> & {
	/** the options to toggle between */
	options: Options;

	/** the currently selected option */
	value: null | Value;

	/** the function to call when the selected option changes */
	onChange: (value: Value, event: MouseEvent<HTMLElement>) => void;
};

export const ToggleButton = <
	Value extends string,
	Options extends Readonly<Value[] | ToggleButtonObjectOption<Value>[]>,
>({
	options,
	value,
	onChange,
	...groupProps
}: ToggleButtonProps<Value, Options>) => {
	return (
		<ToggleButtonGroup
			{...groupProps}
			value={value}
			exclusive={groupProps.exclusive ?? true}
			color={groupProps.color ?? 'primary'}
			onChange={(event, newValue) => {
				onChange(newValue as Value, event);
			}}
		>
			{options.map((option) => {
				const isObj = typeof option === 'object';
				const label = isObj ? option.label : humanizeToken(option);
				const currValue = isObj ? option.value : option;
				const props = isObj ? omit(option, ['label', 'value']) : {};
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
