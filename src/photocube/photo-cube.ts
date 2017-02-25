import THREE = require("three");
import { bindable } from 'aurelia-templating';
import { DOM } from 'aurelia-pal';
import { inject } from 'aurelia-dependency-injection';

class MouseTracker {
  public mouseDown: boolean = false;
  public x: number = 0;
  public y: number = 0;
  public lat: number = 0;
  public lon: number = 0;

  constructor() { }
}

class CameraTracker {
  public lat: number = 0;
  public lon: number = 0;

  constructor() { }
}

export class PhotoCube {
  @bindable panoramicSetName;
  @bindable panoramicSetPath;
  @bindable panoramicImageFormat;

  private Camera: THREE.Camera;
  private Scene: THREE.Scene;
  private Renderer: THREE.Renderer;
  private Mesh: THREE.Mesh;
  private ViewPort: HTMLDivElement;

  private MouseTracker: MouseTracker;
  private CameraPositions: CameraTracker;

  public created() {
    this.MouseTracker = new MouseTracker();
    this.CameraPositions = new CameraTracker();

    this.Renderer = new THREE.WebGLRenderer();
    this.Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    this.Scene = new THREE.Scene();
  }

  public bind() {

  }

  public attached() {
    this.InitPhotocube();
  }

  public detached() {

  }

  public unbind() {

  }

  public InitPhotocube() {

    this.Renderer.setSize(window.innerWidth, window.innerHeight);

    this.ViewPort.appendChild(this.Renderer.domElement);

    this.Camera.target = new THREE.Vector3(0, 0, 0);

    var cube = new THREE.BoxGeometry(100, 100, 100);
    cube.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));

    var textureCube = this.LoadCubeTextures();

    var material = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: textureCube, overdraw: true });

    var sphereMesh = new THREE.Mesh(cube, material);
    this.Scene.add(sphereMesh);

    this.ViewPort.addEventListener("mousedown", this.MouseDownEvent, false);
    document.addEventListener("mousemove", this.MouseMoveEvent, false);
    document.addEventListener("mouseup", () => { this.MouseTracker.mouseDown = false; }, false);

    this.RenderLoop();
  }

  public LoadCubeTextures() {
    let loader = new THREE.CubeTextureLoader();

    loader.setPath(`${this.panoramicSetPath}/`);

    return loader.load([
      `${this.panoramicSetName}_Back.${this.panoramicImageFormat}`,
      `${this.panoramicSetName}_Front.${this.panoramicImageFormat}`,
      `${this.panoramicSetName}_Bottom.${this.panoramicImageFormat}`,
      `${this.panoramicSetName}_Top.${this.panoramicImageFormat}`,
      `${this.panoramicSetName}_Left.${this.panoramicImageFormat}`,
      `${this.panoramicSetName}_Right.${this.panoramicImageFormat}`
    ]);
  }

  public RenderLoop = () => {
    requestAnimationFrame(this.RenderLoop);

    this.CameraPositions.lon = Math.max(-85, Math.min(85, this.CameraPositions.lon));

    this.Camera.target.x = 500 * Math.sin(THREE.Math.degToRad(90 - this.CameraPositions.lon)) * Math.cos(THREE.Math.degToRad(this.CameraPositions.lat));
    this.Camera.target.y = 500 * Math.cos(THREE.Math.degToRad(90 - this.CameraPositions.lon));
    this.Camera.target.z = 500 * Math.sin(THREE.Math.degToRad(90 - this.CameraPositions.lon)) * Math.sin(THREE.Math.degToRad(this.CameraPositions.lat));
    this.Camera.lookAt(this.Camera.target);

    this.Renderer.render(this.Scene, this.Camera);
  }

  public MouseDownEvent = (event) => {

    event.preventDefault();

    this.MouseTracker.mouseDown = true;

    this.MouseTracker.x = event.clientX;
    this.MouseTracker.y = event.clientY;

    this.MouseTracker.lat = this.CameraPositions.lat;
    this.MouseTracker.lon = this.CameraPositions.lon;

  }

  public MouseMoveEvent = (event) => {

    if (this.MouseTracker.mouseDown) {
      this.CameraPositions.lat = (this.MouseTracker.x - event.clientX) * 0.1 + this.MouseTracker.lat;
      this.CameraPositions.lon = (event.clientY - this.MouseTracker.y) * 0.1 + this.MouseTracker.lon;
    }

  }

}
