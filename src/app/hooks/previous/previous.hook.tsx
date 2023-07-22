import { useEffect, useRef } from 'react';

/** sends back the previous value of the given ref and updates the current value */
export const usePrevious = <Value extends unknown>(
	valueToCheck: Value,
): Value | undefined => {
	const ref = useRef<Value>();
	useEffect(() => {
		ref.current = valueToCheck;
	});
	return ref.current;
};
