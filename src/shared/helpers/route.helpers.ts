import { redirect } from 'react-router-dom';

import { getLocalStorageUser } from '~/app/hooks/user.hook';

import type {
	IndexRouteObject,
	LoaderFunction,
	NonIndexRouteObject,
	Params,
	ShouldRevalidateFunction,
} from 'react-router-dom';
import type { TSidebarGroup } from '~/app/components/panels/sidebar.component';
import type { UserType } from '~/app/schemas/user.schema';
import type { App } from '~/app/types/app.types';

export const getParamId = (params: Params): App.dbId => {
	const id = Number(params.id);
	if (isNaN(id)) throw new Error("Route param 'id' must be a number");
	return id as App.dbId;
};

type AvailableTo = {
	/** the user types that can access this page. available to everyone if excluded */
	availableTo?: UserType[];
};

export type AppRoute =
	| (IndexRouteObject & AvailableTo)
	| (Omit<NonIndexRouteObject, 'children'> &
			AvailableTo & { children?: AppRoute[] });

export type DashboardRoute = Omit<NonIndexRouteObject, 'children' | 'path'> & {
	path: string;

	/** the label to show for the route in the sidebar */
	label?: string;

	/** the name of the sidebar group for the schema */
	group: TSidebarGroup;

	/** the user types that can access this page. available to everyone if excluded */
	availableTo?: UserType[];

	children: AppRoute[];
};

const transformRouteProps = (routes: AppRoute[]): AppRoute[] => {
	return routes.map((route) => {
		const shouldRevalidate: ShouldRevalidateFunction =
			route.shouldRevalidate ??
			((args) => {
				const { currentUrl, nextUrl } = args;
				// TODO to prevent loader triggering on searchParams update. Remove after moving to server side pagination and filtering
				const onlySearchParamsChanged =
					!args.actionResult &&
					currentUrl.pathname === nextUrl.pathname &&
					currentUrl.search !== nextUrl.search;

				if (onlySearchParamsChanged) return false;
				return args.defaultShouldRevalidate;
			});
		const loader: LoaderFunction = (args) => {
			const user = getLocalStorageUser();
			if (!user) return redirect('/login');
			if (route.availableTo && !route.availableTo.includes(user.UserType))
				throw new Error('You do not have access to this route!');
			return route.loader?.(args) ?? null;
		};
		if (route.index) return { ...route, shouldRevalidate, loader };

		return {
			...route,
			shouldRevalidate,
			loader,
			children: route.children
				? transformRouteProps(route.children)
				: undefined,
		};
	});
};

export const createDashboardRoutes = (
	routes: DashboardRoute[],
): DashboardRoute[] => {
	return transformRouteProps(routes) as never;
};
