import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '~/shared/helpers/test';

import { Login } from './login.route';

type SetupParams = {
	username?: string;
	password?: string;
	shouldClick?: boolean;
};

const setup = async (
	{ username, password, shouldClick }: SetupParams = {
		username: '',
		password: '',
	},
) => {
	const user = userEvent.setup();

	renderWithProviders(<Login />);

	const userInput = screen.getByLabelText(/user name/iu);
	const passwordInput = screen.getByLabelText(/password/iu);
	const submitButton = screen.getByRole('button', {
		name: /login/iu,
	});

	if (username) await user.type(userInput, username);
	else await user.clear(userInput);

	if (password) await user.type(passwordInput, password);
	else await user.clear(userInput);

	if (shouldClick) await user.click(submitButton);

	return {
		submitButton,
	};
};

test('disables submission when user or password is empty', async () => {
	const { submitButton } = await setup();
	expect(submitButton).toBeDisabled();
});

test('enables submission when user and password are entered', async () => {
	const { submitButton } = await setup({
		username: 'test',
		password: 'test',
	});

	expect(submitButton).toBeEnabled();
});

test.skip('logs user into the app on correct login', async () => {
	await setup({
		username: 'test',
		password: 'test',
		shouldClick: true,
	});

	const status = await screen.findByText(/login successful/iu);
	expect(status).toBeInTheDocument();
});

test.skip('shows appropriate error when user is incorrect', async () => {
	await setup({
		username: 'test1',
		password: 'test',
		shouldClick: true,
	});

	const status = await screen.findByText(/no user with this username exists/iu);
	expect(status).toBeInTheDocument();
});

test.skip('shows appropriate error when password is incorrect', async () => {
	await setup({
		username: 'test',
		password: 'test1',
		shouldClick: true,
	});

	const status = await screen.findByText(/incorrect signin information/iu);
	expect(status).toBeInTheDocument();
});
