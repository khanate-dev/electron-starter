/** global type alias for a generic object type */
type Obj = Record<string, unknown>;

declare module '*.svg' {
	const content: string;
	// eslint-disable-next-line import/no-default-export
	export default content;
}

declare module '*.css' {
	const content: string;
	// eslint-disable-next-line import/no-default-export
	export default content;
}
