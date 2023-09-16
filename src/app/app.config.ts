export const environment = window.ipc.app.env;

export const backendPath = {
	development: 'http://10.0.0.9:8888/api',
	test: 'http://10.0.0.9:8888/api',
	production: 'http://172.16.1.83:4005/api',
}[environment];

export const isFetchMocked = {
	development: false,
	test: false,
	production: false,
}[environment];

export const disableAuth = {
	development: false,
	test: false,
	production: false,
}[environment];
