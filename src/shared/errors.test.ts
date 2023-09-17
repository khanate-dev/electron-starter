/* eslint-disable vitest/max-expects */
import { ApiError, AuthError, ConnectionError, stringifyError } from './errors';

test('testing getCatchMessage', () => {
	expect(stringifyError(new Error('error message'))).toBe('error message');
	expect(stringifyError(new Error(''))).toBe('');
	expect(stringifyError({})).toBe(JSON.stringify({}));
	expect(stringifyError('string')).toBe('string');
	expect(stringifyError(123)).toBe('123');
	expect(stringifyError(null)).toBe('null');
	expect(stringifyError(undefined)).toBe('undefined');
	expect(stringifyError(true)).toBe('true');
	expect(stringifyError(false)).toBe('false');
	expect(stringifyError(NaN)).toBe('NaN');
	expect(stringifyError(new AuthError('error message'))).toBe('error message');
	expect(stringifyError(new ApiError('error message'))).toBe('error message');
	expect(stringifyError(new ConnectionError('error message'))).toBe(
		'error message',
	);
});
