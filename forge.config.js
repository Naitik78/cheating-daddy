module.exports = {
  packagerConfig: {},
  makers: [
    { name: "@electron-forge/maker-squirrel" },
    { name: "@electron-forge/maker-zip", platforms: ["darwin"] },
    { name: "@electron-forge/maker-deb" },
    { name: "@electron-forge/maker-rpm" }
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-webpack",
      config: {
        mainConfig: "./webpack.main.config.js",
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [
            {
              html: "./src/renderer/index.html",
              js: "./src/renderer/index.jsx",
              name: "main_window"
            }
          ]
        }
      }
    }
  ]
};
