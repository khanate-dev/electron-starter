import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// import { isFetchMocked } from '~/app/config';

import { App } from './app';

// if (isFetchMocked) {
// 	const { worker } = require('mocks/browser');
// 	worker.start();
// }

const rootElement = document.getElementById('root');

if (!rootElement) throw new Error('root element not found in index.html');

const root = createRoot(rootElement);

root.render(
	<StrictMode>
		<App />
	</StrictMode>,
);
