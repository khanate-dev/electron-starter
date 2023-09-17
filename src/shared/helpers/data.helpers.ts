import type { App } from '~/app/types/app.types';

/**
 * creates a `localId` for the next row in a list.
 * id is found by finding the last id and incrementing it by 1
 * @param list the existing list of data
 */
export const createLocalId = <T extends App.withLocalId<Obj>>(
	list: T[],
): App.localId => {
	const lastId = Math.max(
		...list.map((row) => row._localId as unknown as number),
		0,
	);
	return (lastId + 1) as App.localId;
};
