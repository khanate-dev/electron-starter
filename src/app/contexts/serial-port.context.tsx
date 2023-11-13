import { createContext, useContext, useEffect, useState } from 'react';

import { dayjsUtc } from '~/helpers/date.helpers';
import { createEvent } from '~/helpers/event.helpers';
import { pick } from '~/helpers/object.helpers';

import type { Dayjs } from 'dayjs';
import type { PropsWithChildren } from 'react';

export type SerialPortStatus = {
	type: 'connected' | 'disconnected' | 'paused';
	error?: string;
	reading?: { at: Dayjs; data: string };
};

const SerialPortContext = createContext<SerialPortStatus>({
	type: 'disconnected',
});

const event = createEvent('clear-serial-error');

export const SerialPortProvider = ({ children }: PropsWithChildren) => {
	const [status, setStatus] = useState<SerialPortStatus>({
		type: 'disconnected',
	});

	useEffect(() => {
		window.ipc.serialPort.status().then((type) => {
			setStatus({ type });
		});

		let remove: (() => void) | undefined = undefined;
		window.ipc.serialPort
			.listen((data) => {
				switch (data.type) {
					case 'connected':
					case 'resumed': {
						setStatus((prev) => ({
							...prev,
							type: 'connected',
							error: undefined,
						}));
						break;
					}
					case 'disconnected':
					case 'paused': {
						const type = data.type;
						setStatus((prev) => ({ ...prev, type }));
						break;
					}
					case 'data': {
						setStatus({
							type: 'connected',
							reading: { at: dayjsUtc.utc(), data: data.value },
						});
						break;
					}
					case 'error': {
						setStatus((prev) => ({
							...prev,
							error: data.error.message,
						}));
					}
				}
			})
			.then((res) => {
				remove = res.remove;
			});

		const listener = event.listen(() => {
			setStatus((prev) => ({ ...prev, error: undefined }));
		});

		return () => {
			remove?.();
			window.ipc.serialPort.disconnect();
			listener.remove();
		};
	}, []);

	return (
		<SerialPortContext.Provider value={status}>
			{children}
		</SerialPortContext.Provider>
	);
};

type UseSerialPortArgs = { onData?: (data: string) => void };

export const useSerialPort = ({ onData }: UseSerialPortArgs = {}) => {
	const status = useContext(SerialPortContext);

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!status)
		throw new Error('useSerialPort must be used within a SerialPortProvider');

	useEffect(() => {
		if (!onData) return;
		let remove: (() => void) | undefined = undefined;
		window.ipc.serialPort
			.listen((data) => {
				if (data.type === 'data') onData(data.value);
			})
			.then((res) => {
				remove = res.remove;
			});
		return () => {
			remove?.();
		};
	}, [onData]);

	return {
		status,
		...pick(window.ipc.serialPort, [
			'connect',
			'pause',
			'resume',
			'disconnect',
		]),
		clearError: () => {
			event.emit();
		},
	};
};
