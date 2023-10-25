import { useEffect, useRef, useState } from 'react';

import { stringifyError } from '~/errors';
import { dayjsUtc } from '~/helpers/date.helpers';

export const useCodeReader = () => {
	const [status, setStatus] = useState<
		| { type: 'error'; message: string }
		| { type: 'connecting' | 'disconnecting' | 'disconnected' }
		| { type: 'connected'; reading?: { at: string; data: number } }
	>({ type: 'connecting' });

	const initialized = useRef<boolean>(false);

	useEffect(() => {
		if (initialized.current) return;
		initialized.current = true;
		window.ipc.codeReader
			.connect()
			.then(() => {
				setStatus({ type: 'connected' });
			})
			.catch((error) => {
				setStatus({ type: 'error', message: stringifyError(error) });
			});

		window.ipc.codeReader.listen((data) => {
			setStatus((prev) =>
				prev.type === 'connected'
					? {
							...prev,
							reading: { data, at: dayjsUtc().format('h:mm:ss A') },
					  }
					: prev,
			);
		});

		return () => {
			window.ipc.codeReader.disconnect().catch(() => false);
		};
	}, []);

	return {
		status,
		toggleConnection: async () => {
			if (status.type === 'connecting' || status.type === 'disconnecting')
				return;
			const connected = status.type === 'connected';
			setStatus({ type: connected ? 'disconnecting' : 'connecting' });
			return window.ipc.codeReader[connected ? 'disconnect' : 'connect']()
				.then(() => {
					setStatus({ type: connected ? 'disconnected' : 'connected' });
				})
				.catch((error) => {
					setStatus({ type: 'error', message: stringifyError(error) });
				});
		},
	};
};
