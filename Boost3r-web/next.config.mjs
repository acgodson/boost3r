// @ts-nocheck
/**
 * @param {{ resolve: { fallback: { fs: boolean; }; }; }} config
 */
export function webpack(config, { isServer }) {
  // If client-side, don't polyfill `fs`
  if (!isServer) {
    config.resolve.fallback = {
      fs: false,
      reactStrictMode: false,
    };
  }

  return config;
}
