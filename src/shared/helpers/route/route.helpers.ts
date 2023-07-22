import type { Params } from 'react-router-dom';
import type { App } from '~/app/types/app';

export const getParamId = (params: Params): App.dbId => {
	const id = Number(params.id);
	if (isNaN(id)) throw new Error("Route param 'id' must be a number");
	return id as App.dbId;
};
