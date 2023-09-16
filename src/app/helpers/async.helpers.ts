/**
 * Returns a promise that resolves with void after the given time
 * @param ms the time to wait, in `milliseconds`
 */
export const wait = async (ms: number) =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
