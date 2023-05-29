import type { z } from 'zod';
import type { Theme } from '@mui/material';
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

		/** global union type of app theme color names  */
		type ThemeColor = Extract<
			keyof Theme['palette'],
			| 'primary'
			| 'secondary'
			| 'error'
			| 'success'
			| 'info'
			| 'warning'
			| 'wimetrixPrimary'
			| 'wimetrixSecondary'
		>;

		type DropdownType = StringSelection | NumberSelection | DbId;

		type DropdownOption<Type extends DropdownType> = Prettify<{
			value: Type;
			label: React.Node;
		}>;
	}

	namespace React {
		/** alias for `React.React.Node` */
		type Node = React.ReactNode;
	}
}
