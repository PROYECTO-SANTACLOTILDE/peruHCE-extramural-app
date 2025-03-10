module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [ 
      ["module-resolver", {
          "alias": {
              "@Screens": "./screens",
              "@Components": "./components",
              "@Utils": "./utils",
          },
          "extensions": [
            ".js",
            ".jsx",
          ]
        }
      ], 
    ]
  };
};
