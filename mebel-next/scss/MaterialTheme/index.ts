import { ThemeOptions } from '@mui/material/styles';

export const light: ThemeOptions = {
	palette: {
		mode: 'light',
		primary: { main: '#eb6753', contrastText: '#ffffff' },
		secondary: { main: '#181a20' },
		text: { primary: '#181a20', secondary: '#717171' },
		background: { default: '#ffffff' },
	},
	typography: {
		fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif",
		button: { textTransform: 'none', fontWeight: 500 },
	},
	shape: { borderRadius: 10 },
};
