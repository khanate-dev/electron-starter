import { UserAdd } from './user-add.route';
import { UserImport } from './user-import.route';
import { UserUpdate } from './user-update.route';
import { UserView } from './user-view.route';

import type { AppRoute } from '~/shared/helpers/route.helpers';

export const userRoutes: AppRoute[] = [
	{
		index: true,
		element: <UserView />,
		loader: UserView.loader,
	},
	{
		path: 'add',
		element: <UserAdd />,
		availableTo: ['Administrator'],
	},
	{
		path: 'update/:id',
		element: <UserUpdate />,
		loader: UserUpdate.loader,
		availableTo: ['Administrator'],
	},
	{
		path: 'import',
		element: <UserImport />,
		availableTo: ['Administrator'],
	},
];
