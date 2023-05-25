import { Register } from './register';
import { userRoutes } from './user';

import type { NonIndexRouteObject } from 'react-router-dom';
import type { UserType } from '~/app/schemas/user';

type DashboardRoute = {
	/** the route path  */
	path: string;

	/** the label to show for the route in the sidebar */
	label?: string;

	/** the user types that can access this page. available to everyone if excluded */
	availableTo?: UserType[];
} & NonIndexRouteObject;

export const dashboardRoutes: DashboardRoute[] = [
	{
		path: 'user',
		children: userRoutes,
	},
	{
		path: 'register',
		label: 'Create User',
		availableTo: ['Administrator'],
		element: <Register />,
		loader: Register.loader,
	},
];
