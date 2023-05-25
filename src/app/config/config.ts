const environment = process.env.DEV ? 'development' : 'production';
console.log(process.env.DEV);

export const apiEndpoint = {
	development: 'http://10.0.0.9:8888/api',
	production: 'http://172.16.1.83:4005/api',
}[environment];

export const isFetchMocked = {
	development: false,
	production: false,
}[environment];

export const disableAuth = {
	development: false,
	production: false,
}[environment];
