/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { cx } from './style.helpers';

import type { CxInput } from './style.helpers';

type Test = {
	input: CxInput[];
	output: string;
};

const tests: Test[] = [
	{
		input: [
			undefined,
			false && 'first',
			true && 'second',
			'third fourth',
			['fifth', 'sixth', false && 'seventh'],
		],
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

test.each(tests)('testing cx', ({ input, output }) => {
	const response = cx(...input);
	expect(response).toStrictEqual(output);
});
