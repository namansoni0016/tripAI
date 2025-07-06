/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
        {
            protocol: "https",
            hostname: "**.ufs.sh",
        },
        {
            protocol: "https",
            hostname: "lh3.googleusercontent.com",
        },
        ],
    },
};

export default nextConfig;
