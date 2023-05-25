import { UserAdd } from './add';
import { UserUpdate } from './update';
import { UserView } from './view';

import type { RouteObject } from 'react-router-dom';

export const userRoutes: RouteObject[] = [
	{
		index: true,
		element: <UserView />,
		loader: UserView.loader,
	},
	{
		path: 'add',
		element: <UserAdd />,
	},
	{
		path: 'update/:id',
		element: <UserUpdate />,
		loader: UserUpdate.loader,
	},
];
