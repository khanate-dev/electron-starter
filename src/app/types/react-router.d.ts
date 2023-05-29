import type { LoaderFunction } from 'react-router-dom';

declare module 'react-router-dom' {
	function useLoaderData<T extends LoaderFunction>(): Awaited<ReturnType<T>>;
}

export declare global {
	namespace Router {
		/** alias for `LoaderFunction` type from `react-router` */
		type Loader = LoaderFunction;

		/** alias for `ActionFunction` type from `react-router` */
		type Action = ActionFunction;
	}
}
