/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DEV?: '1';
		}
	}
}
export {};
