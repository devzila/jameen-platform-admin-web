const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Netlify uses @netlify/plugin-nextjs (do not use standalone there).
  // Standalone remains available for Docker / self-hosted Node deploys.
  ...(process.env.NETLIFY ? {} : { output: "standalone" }),
  outputFileTracingRoot: path.join(__dirname),
  sassOptions: {
    silenceDeprecations: ["legacy-js-api", "import"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
