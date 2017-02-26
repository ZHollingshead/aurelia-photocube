define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config
            .globalResources([
            './photocube/photo-cube'
        ]);
    }
    exports.configure = configure;
});
