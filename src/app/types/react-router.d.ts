import type { LoaderFunction } from 'react-router-dom';

declare module 'react-router-dom' {
	function useLoaderData<T extends LoaderFunction>(): Awaited<ReturnType<T>>;
}
