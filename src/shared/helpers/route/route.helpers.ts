import type { Params } from 'react-router-dom';

export const getParamId = (params: Params): App.DbId => {
	const id = Number(params.id);
	if (isNaN(id)) throw new Error("Route param 'id' must be a number");
	return id as App.DbId;
};
