import { usePrevious } from '~/app/hooks/previous.hook';
import { objectKeys } from '~/shared/helpers/object.helpers';

/** checks if the given value has changed */
export const useCompare = <T extends unknown>(valueToCheck: T): boolean => {
	const prevValue = usePrevious(valueToCheck);
	return prevValue !== valueToCheck;
};

/** shallow compare an array for changed indexes */
export const useArrayCompare = (array: unknown[]): number[] => {
	const prevArray = usePrevious(array);
	const changedIndexes = [];
	for (let i = 0; i < array.length; i++)
		if (array[i] !== prevArray?.[i]) changedIndexes.push(i);

	return changedIndexes;
};

/** shallow compare an object for changed keys */
export const useObjectCompare = <T extends Obj>(object: T): (keyof T)[] => {
	const previousObject = usePrevious(object);
	const changedKeys = objectKeys(object).filter(
		(key) => object[key] !== previousObject?.[key],
	);
	return changedKeys;
};
