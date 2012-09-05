({
    appDir: "./",
    baseUrl: "app",
    dir: "../build",
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