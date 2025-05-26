import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin()
const nextConfig = withNextIntl({
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'utfs.io',
                port: '',
            },
        ],
    },
})


export default nextConfig
