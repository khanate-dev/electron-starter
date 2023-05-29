import { cx } from './style.helpers';

import type { CxInput } from './style.helpers';

type Test = {
	input: CxInput[];
	output: string;
};

const tests: Test[] = [
	{
		/* eslint-disable @typescript-eslint/no-unnecessary-condition */
		input: [
			undefined,
			false && 'first',
			true && 'second',
			'third fourth',
			['fifth', 'sixth', false && 'seventh'],
		],
		/* eslint-enable @typescript-eslint/no-unnecessary-condition */
		output: 'second third fourth fifth sixth',
	},
	{
		input: [],
		output: '',
	},
	{
		input: [undefined, false, null, 'class'],
		output: 'class',
	},
];

describe('test cx helper', () => {
	it.each(tests)(
		`should return valid classes for cx call`,
		({ input, output }) => {
			const response = cx(...input);
			expect(response).toStrictEqual(output);
		}
	);
});
