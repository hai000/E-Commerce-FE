import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin()
const nextConfig = withNextIntl({
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'files.catbox.moe',
                port: '',
            },
        ],
    },
})


export default nextConfig
