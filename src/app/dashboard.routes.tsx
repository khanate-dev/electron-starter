import { userRoutes } from './routes/dashboard/user/user.routes';
import { createDashboardRoutes } from './helpers/route.helpers';

export const dashboardRoutes = createDashboardRoutes([
	{
		path: 'user',
		children: userRoutes,
		group: 'bottom',
	},
]);
