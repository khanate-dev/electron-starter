import { useEffect } from 'react';

export type DebounceOptions<T extends unknown> = {
	/** the value to debounce */
	value: T;

	/** the delay by which to debounce in `ms`. @default `250` */
	delay?: number;

	/** the function to call after debounce */
	onChange: (value: T) => void;
};

export const useDebounce = <T extends unknown>({
	value,
	delay = 250,
	onChange,
}: DebounceOptions<T>) => {
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			onChange(value);
		}, delay);
		return () => {
			clearTimeout(timeoutId);
		};
	}, [value, delay, onChange]);
};
