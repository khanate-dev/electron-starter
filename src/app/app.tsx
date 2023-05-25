import { createHashRouter } from 'react-router-dom';

import { Dashboard, dashboardRoutes } from '~/app/routes/dashboard';
import { Welcome } from '~/app/routes/dashboard/welcome';
import { Providers } from '~/app/components/app/providers';
import { ErrorBoundary } from '~/app/components/app/error-boundary';
import { Login } from '~/app/routes/login';

const router = createHashRouter([
	{
		path: 'login',
		element: <Login />,
		errorElement: <ErrorBoundary />,
		loader: Login.loader,
	},
	{
		path: '',
		element: <Dashboard />,
		errorElement: <ErrorBoundary />,
		loader: Dashboard.loader,
		children: [
			{
				errorElement: <ErrorBoundary />,
				children: [
					{
						index: true,
						element: <Welcome />,
					},
					...dashboardRoutes,
				],
			},
		],
	},
]);

export const App = () => {
	return <Providers router={router} />;
};
