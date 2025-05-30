import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin()
const nextConfig = withNextIntl({
    images: {
        remotePatterns: [
            {
                hostname: 'files.catbox.moe',
            },
            {
                hostname:'localhost'
            }
        ],
    },
})


export default nextConfig
