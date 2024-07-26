/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
const { addDynamicIconSelectors } = require('@iconify/tailwind')

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				'sans': ['"Montserrat", sans-serif', ...defaultTheme.fontFamily.sans]
			},
			backgroundImage: {
				'radial-gradient': 'radial-gradient(var(--tw-gradient-stops))',
			},
			animation: {
				bounce: 'bounce 0.9s ease infinite',
			  },
			  keyframes: {
				bounce: {
				  '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
				  '40%': { transform: 'translateY(-20px)' },
				  '60%': { transform: 'translateY(-10px)' },
				},
			  },
			  colors: {
				'btn-bg': '#fff',
			},
		},
	},
	plugins: [addDynamicIconSelectors()]
}
