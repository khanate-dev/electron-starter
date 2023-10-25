export const env = window.ipc.app.env;

export const backendPath = {
	development: 'http://10.0.0.9:8888/api',
	test: 'http://10.0.0.9:8888/api',
	production: 'http://172.16.1.83:4005/api',
}[env];

const isFetchMockedConfig: Record<Env, boolean> = {
	development: false,
	test: false,
	production: false,
};
/** should the app use dummy data? used for demos of the frontend */
export const isFetchMocked: boolean = isFetchMockedConfig[env];

const disableAuthConfig: Record<Env, boolean> = {
	development: false,
	test: false,
	production: false,
};

/** should fetch authentication be disabled? */
export const disableAuth = disableAuthConfig[env];
