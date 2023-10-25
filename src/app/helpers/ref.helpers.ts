import { forwardRef } from 'react';

import type { ReactNode, Ref, RefAttributes } from 'react';

type FixedForwardRef = <T, P = {}>(
	render: (props: P, ref: Ref<T>) => ReactNode,
) => (props: P & RefAttributes<T>) => React.ReactNode;

export const fixedForwardRef = forwardRef as FixedForwardRef;
