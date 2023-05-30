/* eslint-disable @typescript-eslint/consistent-type-definitions */
export declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DEV?: '1';
		}
	}
}
