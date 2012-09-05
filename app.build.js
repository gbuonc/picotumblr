({
    appDir: "./",
    baseUrl: "app",
    dir: "../tme-build",
    optimizeCss: "standard",
    inlineText: true,
    removeCombined: true,
    fileExclusionRegExp: /^\./,
    modules: [
      {
         name: "modules/app"       
      }
    ]
})