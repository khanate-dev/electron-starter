/* eslint-disable vitest/max-expects */
import {
	ApiError,
	AuthError,
	ConnectionError,
	getCatchMessage,
} from './errors';

test('testing getCatchMessage', () => {
	expect(getCatchMessage(new Error('error message'))).toBe('error message');
	expect(getCatchMessage(new Error(''))).toBe('');
	expect(getCatchMessage({})).toBe(JSON.stringify({}));
	expect(getCatchMessage('string')).toBe('string');
	expect(getCatchMessage(123)).toBe('123');
	expect(getCatchMessage(null)).toBe('null');
	expect(getCatchMessage(undefined)).toBe('undefined');
	expect(getCatchMessage(true)).toBe('true');
	expect(getCatchMessage(false)).toBe('false');
	expect(getCatchMessage(NaN)).toBe('NaN');
	expect(getCatchMessage(new AuthError('error message'))).toBe('error message');
	expect(getCatchMessage(new ApiError('error message'))).toBe('error message');
	expect(getCatchMessage(new ConnectionError('error message'))).toBe(
		'error message',
	);
});
