import { z } from 'zod';

export const _localIdSchema = z
	.number()
	.int()
	.positive()
	.finite()
	.brand('_localId');

/**
 * creates a `localId` for the next row in a list.
 * id is found by finding the last id and incrementing it by 1
 * @param list the existing list of data
 */
export const createLocalId = <T extends App.WithLocalId<Obj>>(
	list: T[]
): App._LocalId => {
	const lastId = Math.max(
		...list.map((row) => row._localId as unknown as number),
		0
	);
	return (lastId + 1) as App._LocalId;
};
