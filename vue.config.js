const bootstrapSassAbstractsImports = require('vue-cli-plugin-bootstrap-vue/sassAbstractsImports.js')
module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                "win": {
                    "target": ["nsis"],
                    "signAndEditExecutable": true,
                },
                "productName": "DragHTML",
                "appId": "DragHTML",
                "directories": {
                    "buildResources": "build",
                },
                "nsis": {
                    "artifactName": "${productName}_${version}.${ext}",
                    "oneClick": false,
                    "allowToChangeInstallationDirectory": false,
                    "perMachine": false,
                    "differentialPackage": true,
                    "createDesktopShortcut": true,
                    "runAfterFinish": true,
                },
            }
        },
    },
    css: {
        loaderOptions: {
            sass: {
                additionalData: bootstrapSassAbstractsImports.join('\n')
            },
            scss: {
                additionalData: [...bootstrapSassAbstractsImports, ''].join(';\n')
            }
        }
    },
    runtimeCompiler: true,
}