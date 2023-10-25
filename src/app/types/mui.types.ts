import type { SxProps, Theme } from '@mui/material';
import type { SystemStyleObject } from '@mui/system';
import type { Utils } from '../../shared/types/utils.types';

export declare namespace Mui {
	type propsWithSx<T extends Record<string, unknown> = {}> = Utils.prettify<
		{
			/** the styles to apply to the component */
			sx?: Mui.sxProp;
		} & T
	>;

	/** global type helper for the `sx` props on component */
	type sxProp = SxProps<Theme>;

	/** global type helper for valid styles accepted by `sx` props */
	type sxStyle =
		| SystemStyleObject<Theme>
		| ((theme: Theme) => SystemStyleObject<Theme>);

	/** global type helper for valid style objects. use it with `satisfies` */
	type sxStyleObj<T extends string = string> = Record<T, Mui.sxStyle>;

	/** global union type of app theme color names  */
	type themeColor = Extract<
		keyof Theme['palette'],
		| 'primary'
		| 'secondary'
		| 'error'
		| 'success'
		| 'info'
		| 'warning'
		| 'wimetrixPrimary'
		| 'wimetrixSecondary'
	>;
}
