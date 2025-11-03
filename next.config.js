const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin('./i18n/request.ts', {
  trailingSlash: false
});

/** @type {import('next').NextConfig}    */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mars-images.imgix.net',
        port: '',
        pathname: '/seobot/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.seobotai.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
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
  experimental: {
    appDir: true,
  },
};

module.exports = withNextIntl(nextConfig);
