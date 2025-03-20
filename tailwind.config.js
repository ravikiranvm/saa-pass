/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
                'gowun': ["Bebas Neue", 'sans-serif'],
				'roboto': ["Roboto", 'sans-serif']
            },
		}
	},

	plugins: []
};
