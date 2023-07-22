import type { LoggedInUser } from '~/app/schemas/user';

export type EventMap = {
	simple: ['logout', 'toggleDarkMode'];
	custom: {
		login: LoggedInUser;
		updateDarkMode: boolean;
	};
};

export type Events = {
	emit<T extends EventMap['simple'][number]>(this: void, name: T): void;
	emit<T extends keyof EventMap['custom']>(
		this: void,
		name: T,
		detail: EventMap['custom'][T],
	): void;
	listen<T extends EventMap['simple'][number]>(
		this: void,
		name: T,
		listener: (event: CustomEvent<Readonly<undefined>>) => void,
	): { remove: () => void };
	listen<T extends keyof EventMap['custom']>(
		this: void,
		name: T,
		listener: (event: CustomEvent<Readonly<EventMap['custom'][T]>>) => void,
	): { remove: () => void };
};

export const events: Events = {
	emit: (name: string, detail?: unknown) => {
		const event = new CustomEvent(name, { detail });
		window.dispatchEvent(event);
	},
	listen: (name: string, listener: (event: CustomEvent) => void) => {
		window.addEventListener(name, listener as never);
		return {
			remove: () => {
				window.removeEventListener(name, listener as never);
			},
		};
	},
};
