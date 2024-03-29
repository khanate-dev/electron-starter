export declare global {
	type Env = 'development' | 'production' | 'test';

	namespace NodeJS {
		interface ProcessEnv {
			DEV?: '1';
		}
	}

	// Forge environment variables.
	const MAIN_WINDOW_WEBPACK_ENTRY: string;
	const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
}
