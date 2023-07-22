import type { ReactNode } from 'react';
import type { z } from 'zod';
import type { ENVIRONMENTS } from '~/app/config';
import type { _localIdSchema } from '~/shared/helpers/data';
import type {
	NumberSelection,
	StringSelection,
	dbIdSchema,
} from '~/shared/helpers/schema';
import type { Utils } from '~/shared/types/utils';

export declare namespace App {
	/** global union type of possible app environment */
	type env = (typeof ENVIRONMENTS)[number];

	/** global branded type for database ids */
	type dbId = z.infer<typeof dbIdSchema>;

	/** global branded type for `_localId` field in data objects */
	type localId = z.infer<typeof _localIdSchema>;

	/** global type helper for generic object types containing `_localId`  */
	type withLocalId<Type extends Obj> = Type & { _localId: localId };

	type dropdownType = StringSelection | NumberSelection | dbId;

	type dropdownOption<Type extends dropdownType> = Utils.prettify<{
		value: Type;
		label: ReactNode;
	}>;
}
