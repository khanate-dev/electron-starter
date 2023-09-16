 
import type { PaletteColor, PaletteColorOptions } from '@mui/material';

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
