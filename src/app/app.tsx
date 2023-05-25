import { environment } from './config';

export const App = () => {
	return (
		<>
			<h1>💖 Hello World! 💖</h1>
			<p>Welcome to your Electron application.</p>
			<p>Running in {environment}</p>
		</>
	);
};
