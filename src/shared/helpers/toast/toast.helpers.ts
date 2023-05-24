import { toast } from 'react-hot-toast';

import { getCatchMessage } from 'errors';

export const addToast = (
	message: unknown,
	type: 'info' | 'error' | 'success' | 'loading' = 'error'
): string => {
	const string = getCatchMessage(message);
	if (type === 'info') return toast(string);
	return toast[type](string);
};

export const promiseToast = (
	promise: Promise<any>,
	variation: 'loading' | 'submitting'
) => {
	toast.promise(promise, {
		loading: {
			loading: 'Loading data...',
			submitting: 'Submitting request...',
		}[variation],
		success: {
			loading: 'Loaded!',
			submitting: 'Successful!',
		}[variation],
		error: getCatchMessage,
	});
};

export const removeToast = (id: string) => toast.dismiss(id);
