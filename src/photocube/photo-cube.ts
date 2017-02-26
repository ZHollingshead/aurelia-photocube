import * as THREE from 'three';
import { bindable } from 'aurelia-templating';
import { bindingMode } from 'aurelia-binding';

class MouseTracker {
  public mouseDown: boolean = false;
  public x: number = 0;
  public y: number = 0;
  public lat: number = 0;
  public lon: number = 0;
}

class CameraTracker {
  public lat: number = 0;
  public lon: number = 0;
}

export class PhotoCube {
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  public panoramicSetName: String;

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  public panoramicSetPath: String;

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  public panoramicImageFormat: String;

  private Camera: THREE.Camera;
  private Cube: THREE.BoxGeometry;
  private Material: THREE.MeshBasicMaterial;
  private Mesh: THREE.Mesh;
  private Renderer: THREE.Renderer;
  private Scene: THREE.Scene;
  private ViewPort: HTMLDivElement;

  private MouseTracker: MouseTracker;
  private CameraPositions: CameraTracker;

  public created() {
    this.MouseTracker = new MouseTracker();
    this.CameraPositions = new CameraTracker();

    this.Renderer = new THREE.WebGLRenderer();
    this.Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    this.Scene = new THREE.Scene();
    this.Cube = new THREE.BoxGeometry(100, 100, 100);
  }

  public bind() {
    this.Renderer.setSize(window.innerWidth, window.innerHeight);

    this.Renderer.domElement.style.height = '';
    this.Renderer.domElement.style.width = '';

    this.ViewPort.appendChild(this.Renderer.domElement);
    this.Camera.target = new THREE.Vector3(0, 0, 0);
  }

  public attached() {
    let textureCube = this.LoadCubeTextures();

    this.Material = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: textureCube, overdraw: 0.5 });

    this.Mesh = new THREE.Mesh(this.Cube, this.Material);
    this.Mesh.scale.x = -1;

    this.Scene.add(this.Mesh);

    this.ViewPort.addEventListener('mousedown', this.MouseDownEvent, false);
    window.addEventListener('mousemove', this.MouseMoveEvent, false);
    window.addEventListener( 'resize', this.WindowResizeEvent, false );
    window.addEventListener('mouseup', () => { this.MouseTracker.mouseDown = false; }, false);

    this.RenderLoop();
  }

  public panoramicSetPathChanged() {
    this.UpdateCubeTextures();
  }

  public panoramicImageFormatChanged() {
    this.UpdateCubeTextures();
  }

  public panoramicSetNameChanged() {
    this.UpdateCubeTextures();
  }

  public UpdateCubeTextures() {
    let textureCube = this.LoadCubeTextures();

    this.Scene.children[0].material.envMap = textureCube;
    this.Scene.children[0].material.needsUpdate = true;
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

    this.Camera.target.x = Math.sin(THREE.Math.degToRad(90 - this.CameraPositions.lon)) *
      Math.cos(THREE.Math.degToRad(this.CameraPositions.lat));
    this.Camera.target.y = Math.cos(THREE.Math.degToRad(90 - this.CameraPositions.lon));
    this.Camera.target.z = Math.sin(THREE.Math.degToRad(90 - this.CameraPositions.lon)) *
      Math.sin(THREE.Math.degToRad(this.CameraPositions.lat));

    this.Camera.lookAt(this.Camera.target);

    this.Renderer.render(this.Scene, this.Camera);
  }

  public MouseDownEvent = (event: any) => {

    event.preventDefault();

    this.MouseTracker.mouseDown = true;

    this.MouseTracker.x = event.clientX;
    this.MouseTracker.y = event.clientY;

    this.MouseTracker.lat = this.CameraPositions.lat;
    this.MouseTracker.lon = this.CameraPositions.lon;

  }

  public MouseMoveEvent = (event: any) => {

    if (this.MouseTracker.mouseDown) {
      this.CameraPositions.lat = (this.MouseTracker.x - event.clientX) * 0.1 + this.MouseTracker.lat;
      this.CameraPositions.lon = (event.clientY - this.MouseTracker.y) * 0.1 + this.MouseTracker.lon;
    }

  }

  public WindowResizeEvent = () => {
    this.Camera.aspect = window.innerWidth / window.innerHeight;
    this.Camera.updateProjectionMatrix();
    this.Renderer.setSize( window.innerWidth, window.innerHeight );

    this.Renderer.domElement.style.height = '';
    this.Renderer.domElement.style.width = '';
  }

}
