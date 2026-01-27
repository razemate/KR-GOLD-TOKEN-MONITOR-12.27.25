import { fileURLToPath } from "url";
import path from "path";

/** @type {import("next").NextConfig} */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  basePath: '/gold-token-monitor',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/gold-token-monitor',
        permanent: false,
      },
    ];
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
