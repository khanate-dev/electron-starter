import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createElement } from 'react';
import { createMemoryRouter } from 'react-router-dom';

import { Providers } from '../app';

export const renderWithProviders = (component: JSX.Element) => {
	return {
		user: userEvent.setup(),
		screen: render(
			createElement(Providers, {
				router: createMemoryRouter([{ index: true, element: component }], {
					initialEntries: ['/'],
				}),
			}),
		),
	};
};
