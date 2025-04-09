import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { codeInspectorPlugin } from 'code-inspector-plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.plugins.push(
      codeInspectorPlugin({
        bundler: 'webpack',
        showSwitch: true,
      })
    );
    return config;
  },
};

export default withNextIntl(nextConfig);
