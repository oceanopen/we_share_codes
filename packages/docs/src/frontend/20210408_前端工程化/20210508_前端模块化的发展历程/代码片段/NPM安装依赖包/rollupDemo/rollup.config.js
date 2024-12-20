export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    /**
     * You must supply "output.name" for UMD bundles
     * that have exports so that the exports are accessible in environments without a module loader.
     */
    name: 'bundleSDK',
    format: 'umd',
  },
};
