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
            },
            boxShadow: {
                brand: '0 0 0 4px rgba(23,195,206,0.15)',
            },
        },
    },
    plugins: [],
}
