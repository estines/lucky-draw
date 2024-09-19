/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/lucky-draw', // Replace with your GitHub repository name
    images: {
        unoptimized: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}

export default nextConfig
