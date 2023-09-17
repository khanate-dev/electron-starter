import type { BaseSelectionType } from '~/app/classes/form-schema.class';
import type { ENVIRONMENTS } from '~/app/constants';
import type {
	ZodDbId,
	ZodLocalId,
	ZodNumberSelection,
	ZodStringSelection,
} from '~/shared/helpers/schema.helpers';
import type { Utils } from '~/shared/types/utils.types';

export declare namespace App {
	/** global union type of possible app environment */
	type environment = (typeof ENVIRONMENTS)[number];

	/** global branded type for database ids */
	type dbId = ZodDbId['_output'];

	/** global branded type for `_localId` field in data objects */
	type localId = ZodLocalId['_output'];

	/** global type helper for generic object types containing `_localId`  */
	type withLocalId<Type extends Obj> = Utils.prettify<
		{ _localId: localId } & Type
	>;

	type stringSelection = ZodStringSelection['_output'];

	type numberSelection = ZodNumberSelection['_output'];

	type dropdownType = BaseSelectionType['_output'];

	type dropdownOption<Type extends App.dropdownType> = {
		value: Type;
		label: string;
	};
}
