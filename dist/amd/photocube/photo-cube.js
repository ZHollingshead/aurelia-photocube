var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "three", "aurelia-templating", "aurelia-binding"], function (require, exports, THREE, aurelia_templating_1, aurelia_binding_1) {
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
            this.RenderLoop = function () {
                requestAnimationFrame(_this.RenderLoop);
                _this.CameraPositions.lon = Math.max(-85, Math.min(85, _this.CameraPositions.lon));
                _this.Camera.target.x = Math.sin(THREE.Math.degToRad(90 - _this.CameraPositions.lon)) *
                    Math.cos(THREE.Math.degToRad(_this.CameraPositions.lat));
                _this.Camera.target.y = Math.cos(THREE.Math.degToRad(90 - _this.CameraPositions.lon));
                _this.Camera.target.z = Math.sin(THREE.Math.degToRad(90 - _this.CameraPositions.lon)) *
                    Math.sin(THREE.Math.degToRad(_this.CameraPositions.lat));
                _this.Camera.lookAt(_this.Camera.target);
                _this.Renderer.render(_this.Scene, _this.Camera);
            };
            this.MouseDownEvent = function (event) {
                event.preventDefault();
                _this.MouseTracker.mouseDown = true;
                _this.MouseTracker.x = event.clientX;
                _this.MouseTracker.y = event.clientY;
                _this.MouseTracker.lat = _this.CameraPositions.lat;
                _this.MouseTracker.lon = _this.CameraPositions.lon;
            };
            this.MouseMoveEvent = function (event) {
                if (_this.MouseTracker.mouseDown) {
                    _this.CameraPositions.lat = (_this.MouseTracker.x - event.clientX) * 0.1 + _this.MouseTracker.lat;
                    _this.CameraPositions.lon = (event.clientY - _this.MouseTracker.y) * 0.1 + _this.MouseTracker.lon;
                }
            };
            this.WindowResizeEvent = function () {
                _this.Camera.aspect = window.innerWidth / window.innerHeight;
                _this.Camera.updateProjectionMatrix();
                _this.Renderer.setSize(window.innerWidth, window.innerHeight);
                _this.Renderer.domElement.style.height = '';
                _this.Renderer.domElement.style.width = '';
            };
        }
        PhotoCube.prototype.created = function () {
            this.MouseTracker = new MouseTracker();
            this.CameraPositions = new CameraTracker();
            this.Renderer = new THREE.WebGLRenderer();
            this.Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
            this.Scene = new THREE.Scene();
            this.Cube = new THREE.BoxGeometry(100, 100, 100);
        };
        PhotoCube.prototype.bind = function () {
            this.Renderer.setSize(window.innerWidth, window.innerHeight);
            this.Renderer.domElement.style.height = '';
            this.Renderer.domElement.style.width = '';
            this.ViewPort.appendChild(this.Renderer.domElement);
            this.Camera.target = new THREE.Vector3(0, 0, 0);
        };
        PhotoCube.prototype.attached = function () {
            var _this = this;
            var textureCube = this.LoadCubeTextures();
            this.Material = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: textureCube, overdraw: 0.5 });
            this.Mesh = new THREE.Mesh(this.Cube, this.Material);
            this.Mesh.scale.x = -1;
            this.Scene.add(this.Mesh);
            this.ViewPort.addEventListener('mousedown', this.MouseDownEvent, false);
            window.addEventListener('mousemove', this.MouseMoveEvent, false);
            window.addEventListener('resize', this.WindowResizeEvent, false);
            window.addEventListener('mouseup', function () { _this.MouseTracker.mouseDown = false; }, false);
            this.RenderLoop();
        };
        PhotoCube.prototype.panoramicSetPathChanged = function () {
            this.UpdateCubeTextures();
        };
        PhotoCube.prototype.panoramicImageFormatChanged = function () {
            this.UpdateCubeTextures();
        };
        PhotoCube.prototype.panoramicSetNameChanged = function () {
            this.UpdateCubeTextures();
        };
        PhotoCube.prototype.UpdateCubeTextures = function () {
            var textureCube = this.LoadCubeTextures();
            this.Scene.children[0].material.envMap = textureCube;
            this.Scene.children[0].material.needsUpdate = true;
        };
        PhotoCube.prototype.LoadCubeTextures = function () {
            var loader = new THREE.CubeTextureLoader();
            loader.setPath(this.panoramicSetPath + "/");
            return loader.load([
                this.panoramicSetName + "_Back." + this.panoramicImageFormat,
                this.panoramicSetName + "_Front." + this.panoramicImageFormat,
                this.panoramicSetName + "_Bottom." + this.panoramicImageFormat,
                this.panoramicSetName + "_Top." + this.panoramicImageFormat,
                this.panoramicSetName + "_Left." + this.panoramicImageFormat,
                this.panoramicSetName + "_Right." + this.panoramicImageFormat
            ]);
        };
        return PhotoCube;
    }());
    __decorate([
        aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay })
    ], PhotoCube.prototype, "panoramicSetName", void 0);
    __decorate([
        aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay })
    ], PhotoCube.prototype, "panoramicSetPath", void 0);
    __decorate([
        aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay })
    ], PhotoCube.prototype, "panoramicImageFormat", void 0);
    exports.PhotoCube = PhotoCube;
});
