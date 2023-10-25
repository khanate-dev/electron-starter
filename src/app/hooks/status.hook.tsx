import { useState } from 'react';

import { CustomAlert } from '~/components/feedback/custom-alert.component';
import { AuthError, stringifyError } from '~/errors';
import { csx } from '~/helpers/style.helpers';

import type { Utils } from '@shared/types/utils.types';
import type { Mui } from '~/types/mui.types';

const hiddenStatusTypes = ['idle', 'submitting', 'loading'] as const;
type HiddenType = (typeof hiddenStatusTypes)[number];

const showingStatusTypes = ['error', 'success', 'info', 'warning'] as const;
type ShowingType = (typeof showingStatusTypes)[number];

type HiddenStatus = {
	type: HiddenType;
	hidingFrom?: ShowingType;
};

type ShowingStatus = {
	type: ShowingType;
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
			setStatus(value);
			if (value.hidingFrom) {
				setTimeout(() => {
					setStatus({ ...value, hidingFrom: undefined });
				}, 250);
			}
		} else if (value.type === 'error') {
			setStatus({
				type: 'error',
				message: stringifyError(value.message),
			});
		} else {
			if (value.ephemeral) {
				setTimeout(() => {
					updateStatus({ type: 'idle', hidingFrom: value.type });
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
		statusJsx:
			isShowing || status.hidingFrom ? (
				<CustomAlert
					key={params?.key ?? 'status-hook-jsx'}
					sx={csx({ flexBasis: 40, width: '100%' }, params?.sx)}
					message={isShowing ? status.message : null}
					hidden={!isShowing}
					severity={isShowing ? status.type : status.hidingFrom ?? 'error'}
					onClose={() => {
						if (isHiddenStatus(status)) return;
						updateStatus({ type: 'idle', hidingFrom: status.type });
					}}
				/>
			) : null,
		asyncWrapper,
	};
};
