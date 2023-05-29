export const deleteDialogStyles = {
	content: {
		gap: '5px',
		justifyContent: 'center',
		fontSize: '1.5em',
		textAlign: 'center',
		'& > p': {
			fontSize: 'inherit',
		},
	},
	highlight: {
		padding: '0 5px',
		fontWeight: 'bold',
		display: 'inline-block',
		color: 'error.main',
	},
} satisfies Mui.SxStyleObj;
