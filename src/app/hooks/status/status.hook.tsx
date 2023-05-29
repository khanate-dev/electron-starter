import { useReducer } from 'react';
import { z } from 'zod';

import { CustomAlert } from '~/app/components/feedback/custom-alert';
import { csx } from '~/app/helpers/style';
import { getCatchMessage } from '~/shared/errors';
import { createGroupedOptionalSchema } from '~/shared/helpers/schema';

const hiddenStatusTypes = ['idle', 'submitting', 'loading'] as const;
type HiddenStatusType = (typeof hiddenStatusTypes)[number];

const showingStatusTypes = ['error', 'success', 'info', 'warning'] as const;
type ShowingStatusType = (typeof showingStatusTypes)[number];

type HiddenStatus = {
	type: HiddenStatusType;
};

type ShowingStatus = {
	type: ShowingStatusType;
	message: string;
};

export type Status = HiddenStatus | ShowingStatus;

const statusActionSchema = z
	.strictObject({
		type: z.enum(hiddenStatusTypes),
	})
	.or(
		z.strictObject({
			type: z.literal('error'),
			message: z.unknown(),
		})
	)
	.or(
		z
			.strictObject({
				type: z.enum(['success', 'info', 'warning']),
				message: z.string(),
			})
			.and(
				createGroupedOptionalSchema(
					z.object({
						/** should the message be hidden after the specified `duration`? */
						ephemeral: z.boolean(),
						/** the duration of the message. @default `2500ms` */
						duration: z.number().optional(),
					})
				)
			)
	);

export type StatusAction = z.infer<typeof statusActionSchema>;

const reducer = (_: Status, action: StatusAction): Status => {
	const { type } = action;
	switch (type) {
		case 'error': {
			return {
				type,
				message: getCatchMessage(action.message),
			};
		}
		default:
			return action;
	}
};

const isHiddenStatus = (value: Status): value is HiddenStatus =>
	hiddenStatusTypes.includes(value.type);

export const isStatusAction = (value: unknown): value is StatusAction => {
	return statusActionSchema.safeParse(value).success;
};

type StatusParams = {
	/** the styles to apply to the alert */
	sx?: Mui.SxProp;

	/** the key to add to the status. @default `status-hook-jsx` */
	key?: string;
};

export const useStatus = (params?: StatusParams) => {
	const [status, dispatch] = useReducer(reducer, { type: 'idle' });

	const isShowing = !isHiddenStatus(status);
	const isBusy = status.type === 'loading' || status.type === 'submitting';

	const updateStatus = (value: StatusAction) => {
		if (value.type !== 'error' && !isHiddenStatus(value) && value.ephemeral)
			setTimeout(() => dispatch({ type: 'idle' }), value.duration ?? 2500);

		dispatch(value);
	};

	/**
	 * Async wrapper for loading/submitting. takes care of updating the status.
	 *
	 * The after state will be set to:
	 * - if returning `void`: `idle`
	 * - if returning `string`: `success` with `ephemeral` set to true
	 * - if returning `StatusAction`: the returned object is set
	 */
	const asyncWrapper =
		<Params extends any[]>(
			type: 'load' | 'submit',
			asyncFunction: (...args: Params) => Promise<StatusAction | string | void>
		) =>
		async (...args: Params): Promise<void> => {
			updateStatus({ type: type === 'load' ? 'loading' : 'submitting' });
			if (isBusy)
				throw new Error('page is busy! please wait a couple seconds...');
			try {
				const response = await asyncFunction(...args);
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
				sx={csx({ flexBasis: 50, width: '100%', marginTop: 2 }, params?.sx)}
				message={isShowing ? status.message : null}
				severity={isShowing ? status.type : 'error'}
				hidden={!isShowing}
				onClose={() => dispatch({ type: 'idle' })}
			/>
		),
		asyncWrapper,
	};
};
