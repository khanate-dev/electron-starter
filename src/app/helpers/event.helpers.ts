export const createEvent = <Type = undefined>(name: string) => {
	return {
		emit: (...args: [Type] extends [undefined] ? [] : [value: Type]) => {
			const event = new CustomEvent(name, { detail: args[0] as never });
			window.dispatchEvent(event);
		},
		listen: (listener: (event: CustomEvent<Type>) => void) => {
			window.addEventListener(name, listener as never);
			return {
				remove: () => {
					window.removeEventListener(name, listener as never);
				},
			};
		},
	};
};
