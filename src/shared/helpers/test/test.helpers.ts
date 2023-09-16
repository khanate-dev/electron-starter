import { render } from '@testing-library/react';
import { createElement } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { Providers } from '~/app/app';

export const renderWithProviders = (component: JSX.Element) =>
	render(
		createElement(Providers, {
			router: createBrowserRouter([
				{
					index: true,
					element: component,
				},
			]),
		}),
	);
