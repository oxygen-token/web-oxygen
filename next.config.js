const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig}    */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mov|mp4|webm)$/,
      use: {
        loader: "file-loader",
        options: {
          publicPath: "/_next",
          name: "assets/videos/[name].[hash].[ext]",
        },
      },
    });

    return config;
  },
};

module.exports = withNextIntl(nextConfig);
