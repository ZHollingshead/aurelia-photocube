System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function configure(config) {
        config
            .globalResources([
            './photocube/photo-cube'
        ]);
    }
    exports_1("configure", configure);
    return {
        setters: [],
        execute: function () {
        }
    };
});
