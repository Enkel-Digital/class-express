## Import errors
- This lib can used if the build already started and I swap out local plugins for the lib.
- HOWEVER, I cannot build / start the dev server after I install this directly.
- Bascially I can only build the dev server if I do not name it with vue-cli-plugin prefix! So maybe instead of vue-cli-plugin prefix, since this is NOT a vue-cli plugin but rather a vue plugin...
- If we look at the name of vue-axios, they are not using the plugin name...
- I oso get the import error, where they say cannot use import unless it is in a module
- Sometimes, I get the error of No eslint found too...
- https://github.com/vuejs/vue-cli/issues/2948
    - chainWebpack: config => config.resolve.symlinks(false)
    - bad naming, which causes the CLI to use the package as a cli plugin instead of a normal plugin