export const formTableStyles = {
	form: {
		flexGrow: 1,
		flexShrink: 1,
		display: 'flex',
		flexDirection: 'column',
		overflow: 'hidden',
		flexWrap: 'nowrap',
		gap: 2,
	},
	dropdownHeader: {
		minWidth: 200,
	},
	textField: {
		width: '100%',
		'& > .MuiOutlinedInput-root.MuiInputBase-adornedEnd': {
			paddingRight: 0,
			'& > .MuiInputAdornment-root': {
				'& .MuiIconButton-root': {
					padding: 1,
					borderRadius: 0,
				},
			},
		},
		'& label': {
			'&.MuiInputLabel-outlined.MuiInputLabel-shrink': {
				transform: 'translate(14px, -4px) scale(0.75)',
			},
		},
		'& input[type=number]': {
			MozAppearance: 'textfield',
		},
		'& input::-webkit-outer-spin-button': {
			WebkitAppearance: 'none',
			margin: 0,
		},
		'& input::-webkit-inner-spin-button': {
			WebkitAppearance: 'none',
			margin: 0,
		},
	},
	button: {
		minWidth: 125,
	},
} satisfies Mui.SxStyleObj;
