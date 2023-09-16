import { useState } from 'react';

import { CustomAlert } from '~/app/components/feedback/custom-alert.component';
import { csx } from '~/app/helpers/style.helpers';
import { AuthError, stringifyError } from '~/shared/errors';

import type { Mui } from '~/app/types/mui.types';
import type { Utils } from '~/shared/types/utils.types';

const hiddenStatusTypes = ['idle', 'submitting', 'loading'] as const;
type HiddenStatusType = (typeof hiddenStatusTypes)[number];

const showingStatusTypes = ['error', 'success', 'info', 'warning'] as const;
type ShowingStatusType = (typeof showingStatusTypes)[number];

type HiddenStatus = {
	type: HiddenStatusType;
	prev?: HiddenStatusType | ShowingStatusType;
};

type ShowingStatus = {
	type: ShowingStatusType;
	message: string;
};

export type Status = HiddenStatus | ShowingStatus;

export type StatusUpdate = Utils.prettify<
	| HiddenStatus
	| { type: 'error'; message: unknown }
	| ({
			type: 'success' | 'info' | 'warning';
			message: string;
	  } & Utils.allOrNone<{
			/** should the message be hidden after the specified `duration`? */
			ephemeral: boolean;
			/** the duration of the message. @default `2500ms` */
			duration?: number;
	  }>)
>;

type StatusParams = Mui.propsWithSx<{
	/** the key to add to the status. @default `status-hook-jsx` */
	key?: string;
}>;

const isHiddenStatus = (
	value: Status | StatusUpdate,
): value is HiddenStatus => {
	return hiddenStatusTypes.includes(value.type);
};

export const useStatus = (params?: StatusParams) => {
	const [status, setStatus] = useState<Status>({ type: 'idle' });

	const isShowing = !isHiddenStatus(status);
	const isBusy = status.type === 'loading' || status.type === 'submitting';

	const updateStatus = (value: StatusUpdate) => {
		if (isHiddenStatus(value)) {
			setStatus({ ...value, prev: status.type });
		} else if (value.type === 'error') {
			setStatus({
				type: 'error',
				message: stringifyError(value.message),
			});
		} else {
			const prev = value.type;
			if (value.ephemeral) {
				setTimeout(() => {
					setStatus({ type: 'idle', prev });
				}, value.duration ?? 2500);
			}
			setStatus(value);
		}
	};

	/**
	 * Async wrapper for loading/submitting. takes care of updating the status and error handling.
	 *
	 * The after state will be set to:
	 * - if returning `void`: `idle`
	 * - if returning `string`: `success` with `ephemeral` set to true
	 * - if returning `StatusAction`: the returned object is set
	 */
	const asyncWrapper = async (
		type: 'load' | 'submit',
		func: () =>
			| StatusUpdate
			| string
			| undefined
			| void
			| Promise<StatusUpdate | string | undefined | void>,
	) => {
		updateStatus({ type: type === 'load' ? 'loading' : 'submitting' });
		try {
			if (isBusy)
				throw new Error('page is busy! please wait a couple seconds...');
			const response = await func();
			switch (typeof response) {
				case 'string':
					updateStatus({
						type: 'success',
						message: response,
						ephemeral: true,
					});
					break;
				case 'object':
					updateStatus(response);
					break;
				default:
					updateStatus({ type: 'idle' });
					break;
			}
		} catch (message) {
			if (message instanceof AuthError) throw message;
			updateStatus({ type: 'error', message });
		}
	};

	return {
		status,
		updateStatus,
		isBusy,
		statusJsx: (
			<CustomAlert
				key={params?.key ?? 'status-hook-jsx'}
				sx={csx({ flexBasis: 40, marginBottom: 1, width: '100%' }, params?.sx)}
				message={isShowing ? status.message : null}
				hidden={!isShowing}
				severity={
					isShowing
						? status.type
						: status.prev === 'success' ||
						  status.prev === 'info' ||
						  status.prev === 'warning'
						? status.prev
						: 'error'
				}
				onClose={() => {
					updateStatus({ type: 'idle' });
				}}
			/>
		),
		asyncWrapper,
	};
};
