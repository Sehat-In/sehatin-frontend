/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    images: {
        domains: ['images.unsplash.com', 'storage.googleapis.com'],
    },
};

export default nextConfig;
