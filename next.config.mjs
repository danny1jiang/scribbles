/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActionsBodySizeLimit: "5mb",
	},
};

export default nextConfig;
