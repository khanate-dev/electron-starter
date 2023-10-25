import '@testing-library/jest-dom';

import { act } from '@testing-library/react';

import { Login } from './login.route';

import { renderWithProviders } from '../helpers/test.helpers';

type SetupParams = {
	username?: string;
	password?: string;
	shouldClick?: boolean;
};

const setup = async (opts: SetupParams) => {
	const { user, screen } = renderWithProviders(<Login />);

	const userInput = screen.getByLabelText(/user name/iu);
	const passwordInput = screen.getByLabelText(/password/iu);
	const submitButton = screen.getByRole('button', {
		name: /login/iu,
	});

	await act(async () => {
		if (opts.username) await user.type(userInput, opts.username);
		else await user.clear(userInput);

		if (opts.password) await user.type(passwordInput, opts.password);
		else await user.clear(userInput);

		if (opts.shouldClick) await user.click(submitButton);
	});

	return { screen, submitButton };
};

test('logs user into the app on correct login', async () => {
	const { screen } = await setup({
		username: 'test',
		password: 'test',
		shouldClick: true,
	});

	const status = await screen.findByText(/logged in! redirecting.../iu);
	expect(status).toBeInTheDocument();
});

test('shows appropriate error when user is incorrect', async () => {
	const { screen } = await setup({
		username: 'test1',
		password: 'test',
		shouldClick: true,
	});

	const status = await screen.findByText(
		/no user with this username exists!/iu,
	);
	expect(status).toBeInTheDocument();
});

test('shows appropriate error when password is incorrect', async () => {
	const { screen } = await setup({
		username: 'test',
		password: 'test1',
		shouldClick: true,
	});

	const status = await screen.findByText(/incorrect sign in information!/iu);
	expect(status).toBeInTheDocument();
});
