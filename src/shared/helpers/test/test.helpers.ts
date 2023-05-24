import { createElement } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import { Providers } from 'components/app/providers';

export const renderWithProviders = (component: JSX.Element) =>
	render(
		createElement(Providers, {
			router: createBrowserRouter([
				{
					index: true,
					element: component,
				},
			]),
		})
	);
