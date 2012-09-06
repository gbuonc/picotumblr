({
    appDir: "./",
    baseUrl: "app",
    dir: "../build",
    optimizeCss: "standard",
    inlineText: true,
    removeCombined: true,
    fileExclusionRegExp: /^\.|app.build\.js/,
    modules: [
      {
         name: "modules/app"       
      }
    ]
})