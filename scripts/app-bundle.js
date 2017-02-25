define('app',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App() {
            this.message = 'Hello World!';
        }
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", "./environment"], function (require, exports, environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .globalResources([
            './photocube/photo-cube'
        ])
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('photocube/photo-cube',["require", "exports", "three", "aurelia-templating"], function (require, exports, THREE, aurelia_templating_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MouseTracker = (function () {
        function MouseTracker() {
            this.mouseDown = false;
            this.x = 0;
            this.y = 0;
            this.lat = 0;
            this.lon = 0;
        }
        return MouseTracker;
    }());
    var CameraTracker = (function () {
        function CameraTracker() {
            this.lat = 0;
            this.lon = 0;
        }
        return CameraTracker;
    }());
    var PhotoCube = (function () {
        function PhotoCube() {
            var _this = this;
            this.renderLoop = function () {
                requestAnimationFrame(_this.renderLoop);
                _this.CameraPositions.lon = Math.max(-85, Math.min(85, _this.CameraPositions.lon));
                _this.Camera.target.x = 500 * Math.sin(THREE.Math.degToRad(90 - _this.CameraPositions.lon)) * Math.cos(THREE.Math.degToRad(_this.CameraPositions.lat));
                _this.Camera.target.y = 500 * Math.cos(THREE.Math.degToRad(90 - _this.CameraPositions.lon));
                _this.Camera.target.z = 500 * Math.sin(THREE.Math.degToRad(90 - _this.CameraPositions.lon)) * Math.sin(THREE.Math.degToRad(_this.CameraPositions.lat));
                _this.Camera.lookAt(_this.Camera.target);
                _this.Renderer.render(_this.Scene, _this.Camera);
            };
            this.mouseDownEvent = function (event) {
                event.preventDefault();
                _this.MouseTracker.mouseDown = true;
                _this.MouseTracker.x = event.clientX;
                _this.MouseTracker.y = event.clientY;
                _this.MouseTracker.lat = _this.CameraPositions.lat;
                _this.MouseTracker.lon = _this.CameraPositions.lon;
            };
            this.mouseMoveEvent = function (event) {
                if (_this.MouseTracker.mouseDown) {
                    _this.CameraPositions.lat = (_this.MouseTracker.x - event.clientX) * 0.1 + _this.MouseTracker.lat;
                    _this.CameraPositions.lon = (event.clientY - _this.MouseTracker.y) * 0.1 + _this.MouseTracker.lon;
                }
            };
        }
        PhotoCube.prototype.created = function () {
            this.MouseTracker = new MouseTracker();
            this.CameraPositions = new CameraTracker();
        };
        PhotoCube.prototype.bind = function () {
        };
        PhotoCube.prototype.attached = function () {
            this.InitPhotocube();
        };
        PhotoCube.prototype.detached = function () {
        };
        PhotoCube.prototype.unbind = function () {
        };
        PhotoCube.prototype.InitPhotocube = function () {
            var _this = this;
            this.Renderer = new THREE.WebGLRenderer();
            this.Renderer.setSize(window.innerWidth, window.innerHeight);
            this.ViewPort.appendChild(this.Renderer.domElement);
            this.Scene = new THREE.Scene();
            this.Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
            this.Camera.target = new THREE.Vector3(0, 0, 0);
            var cube = new THREE.BoxGeometry(100, 100, 100);
            cube.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
            var loader = new THREE.CubeTextureLoader();
            loader.setPath(this.panoramicSetPath + "/");
            var textureCube = loader.load([
                this.panoramicSetName + "_Back." + this.panoramicImageFormat,
                this.panoramicSetName + "_Front." + this.panoramicImageFormat,
                this.panoramicSetName + "_Bottom." + this.panoramicImageFormat,
                this.panoramicSetName + "_Top." + this.panoramicImageFormat,
                this.panoramicSetName + "_Left." + this.panoramicImageFormat,
                this.panoramicSetName + "_Right." + this.panoramicImageFormat
            ]);
            var material = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: textureCube, overdraw: true });
            var sphereMesh = new THREE.Mesh(cube, material);
            this.Scene.add(sphereMesh);
            document.addEventListener("mousedown", this.mouseDownEvent, false);
            document.addEventListener("mousemove", this.mouseMoveEvent, false);
            document.addEventListener("mouseup", function () { _this.MouseTracker.mouseDown = false; }, false);
            this.renderLoop();
        };
        PhotoCube.prototype.valueChanged = function (newValue, oldValue) {
        };
        return PhotoCube;
    }());
    __decorate([
        aurelia_templating_1.bindable,
        __metadata("design:type", Object)
    ], PhotoCube.prototype, "value", void 0);
    __decorate([
        aurelia_templating_1.bindable,
        __metadata("design:type", Object)
    ], PhotoCube.prototype, "panoramicSetName", void 0);
    __decorate([
        aurelia_templating_1.bindable,
        __metadata("design:type", Object)
    ], PhotoCube.prototype, "panoramicSetPath", void 0);
    __decorate([
        aurelia_templating_1.bindable,
        __metadata("design:type", Object)
    ], PhotoCube.prototype, "panoramicImageFormat", void 0);
    exports.PhotoCube = PhotoCube;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
    }
    exports.configure = configure;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <photo-cube value=\"hi\" \n              panoramic-set-name=\"2017_FreddysVR\"\n              panoramic-set-path=\"images\"\n              panoramic-image-format=\"jpg\">\n  </photo-cube>\n</template>\n"; });
define('text!photocube/photo-cube.html', ['module'], function(module) { module.exports = "<template>\n    <h1>${value}</h1>\n\n    <section>\n        <h2>aurelia cube</h2>\n        <div ref=\"ViewPort\" style=\"width: 500px; height: 400px;\"></div>\n    </section>\n\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map