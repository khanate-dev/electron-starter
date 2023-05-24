const api_endpoint_development = 'http://10.0.0.9:8888/api';
const api_endpoint_production = 'http://172.16.1.83:4005/api';

export const serialPorts: Record<
	'weightScale' | 'uhfReader' | 'qrCodeReader',
	{
		path: Partial<Record<NodeJS.Platform, string>> & { default: string };
		baudRate?: number;
	}
> = {
	weightScale: {
		path: {
			win32: 'COM100',
			linux: '/dev/weightScale',
			default: '/dev/weightScale',
		},
	},
	uhfReader: {
		path: {
			win32: 'COM101',
			linux: '/dev/uhfReader',
			default: '/dev/uhfReader',
		},
		baudRate: 115200,
	},
	qrCodeReader: {
		path: {
			win32: 'COM102',
			linux: '/dev/qrCodeReader',
			default: '/dev/qrCodeReader',
		},
	},
};

/** Returns true if app is packaged, false otherwise */
export const getIsPackaged = async () => window.app.getIsPackaged();

export const getApiEndpoint = async () =>
	(await getIsPackaged()) ? api_endpoint_production : api_endpoint_development;

const useDummyDataInDevelopment = false;
const useDummyDataInProduction = false;

export const getUseDummyData = async () =>
	(await getIsPackaged())
		? useDummyDataInProduction
		: useDummyDataInDevelopment;
