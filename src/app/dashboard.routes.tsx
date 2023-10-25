import { createDashboardRoutes } from './helpers/route.helpers';
import { userRoutes } from './routes/dashboard/user/user.routes';

export const dashboardRoutes = createDashboardRoutes([
	{
		path: 'user',
		children: userRoutes,
		group: 'settings',
	},
]);
