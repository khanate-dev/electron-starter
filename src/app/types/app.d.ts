import type { z } from 'zod';
import type { ENVIRONMENTS } from '~/app/config';
import type {
	NumberSelection,
	StringSelection,
	dbIdSchema,
} from '~/shared/helpers/schema';
import type { _localIdSchema } from '~/shared/helpers/data';

export declare global {
	namespace App {
		/** global union type of possible app environment */
		type Environment = (typeof ENVIRONMENTS)[number];

		/** global branded type for database ids */
		type DbId = z.infer<typeof dbIdSchema>;

		/** global branded type for `_localId` field in data objects */
		type _LocalId = z.infer<typeof _localIdSchema>;

		/** global type helper for generic object types containing `_localId`  */
		type WithLocalId<Type extends Obj> = Type & { _localId: _LocalId };

		type DropdownType = StringSelection | NumberSelection | DbId;

		type DropdownOption<Type extends DropdownType> = Prettify<{
			value: Type;
			label: React.Node;
		}>;
	}
}
