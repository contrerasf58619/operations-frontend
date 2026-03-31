import type { Config } from 'tailwindcss'

export default <Config>{
    theme: {
        extend: {
            colors: {
                charcoal: '#131416',
                graphite: '#181A1C',
                orange: '#F08A00',
                amber: '#FFB100',
                teal: '#0FA3B1',
                cyan: '#17C3CE',
                'primary-hover': '#131416',
                'primary-light': '#181A1C',
                'primary-border': '#F08A00',
                'background-light': '#f9fafb',
            },
            boxShadow: {
                brand: '0 0 0 4px rgba(23,195,206,0.15)',
            },
            fontFamily: {
                display: ['Inter', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '0.5rem',
            },
        },
    },
    plugins: [],
}
