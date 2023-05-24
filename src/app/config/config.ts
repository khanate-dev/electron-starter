export const getEnvironment = async () => {
	const isPackaged = await window.ipc.app.getIsPackaged();
	return isPackaged ? 'production' : 'development';
};

export const getApiEndpoint = async () => {
	const environment = await getEnvironment();
	return {
		development: 'http://10.0.0.9:8888/api',
		production: 'http://172.16.1.83:4005/api',
	}[environment];
};

export const getIsFetchMocked = async () => {
	const environment = await getEnvironment();
	return {
		development: true,
		production: false,
	}[environment];
};
