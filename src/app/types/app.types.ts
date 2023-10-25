import type { Utils } from '../../shared/types/utils.types';
import type { BaseSelectionType } from '../classes/form-schema.class';
import type {
	ZodDbId,
	ZodLocalId,
	ZodNumberSelection,
	ZodStringSelection,
} from '../helpers/schema.helpers';

export declare namespace App {
	/** branded type for database ids */
	type dbId = ZodDbId['_output'];

	/** branded type for `_localId` field in data objects */
	type localId = ZodLocalId['_output'];

	/** type helper for generic object types containing `_localId`  */
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
