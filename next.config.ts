import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.s3.amazonaws.com', // Cubre todos los buckets S3
            },
            {
                protocol: 'https',
                hostname: '**.alliedgapps.com', // Para otros dominios de la app
            },
        ],
        unoptimized: true,
    },
}

export default withNextIntl(nextConfig)
