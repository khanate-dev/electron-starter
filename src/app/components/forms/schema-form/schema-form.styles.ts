export const formPageStyles = {
	form: {
		flexGrow: 1,
		display: 'flex',
		flexDirection: 'column',
		flexWrap: 'nowrap',
		alignItems: 'center',
		width: '100%',
		'> .MuiAlert-root': {
			maxWidth: 750,
		},
	},
	fieldContainer: {
		display: 'flex',
		justifyContent: 'center',
		width: '100%',
		maxWidth: 900,
		marginInline: 'auto',
		marginBlock: 3,
	},
	fields: {
		flexGrow: 1,
		display: 'grid',
		justifyContent: 'center',
		gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
		gap: 3,
	},
	actions: {
		marginTop: 2,
		display: 'flex',
		gap: 2,
		justifyContent: 'center',
	},
} satisfies Mui.SxStyleObj;
