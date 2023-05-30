/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type {
	PaletteColor,
	PaletteColorOptions,
	Theme,
	SxProps,
} from '@mui/material';
import type { SystemStyleObject } from '@mui/system';

declare module '@mui/material' {
	interface Palette {
		wimetrixPrimary: PaletteColor;
		wimetrixSecondary: PaletteColor;
	}
	// allow configuration using `createTheme`
	interface PaletteOptions {
		wimetrixPrimary: PaletteColorOptions;
		wimetrixSecondary: PaletteColorOptions;
	}
}

export declare global {
	namespace Mui {
		/** global type helper for the `sx` props on component */
		type SxProp = SxProps<Theme>;

		/** global type helper for valid styles accepted by `sx` props */
		type SxStyle =
			| SystemStyleObject<Theme>
			| ((theme: Theme) => SystemStyleObject<Theme>);

		/** global type helper for valid style objects. use it with `satisfies` */
		type SxStyleObj<T extends string = string> = Record<T, Mui.SxStyle>;

		/** global union type of app theme color names  */
		type ThemeColor = Extract<
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
}
