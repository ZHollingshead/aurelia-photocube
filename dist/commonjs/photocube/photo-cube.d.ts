export declare class PhotoCube {
    panoramicSetName: String;
    panoramicSetPath: String;
    panoramicImageFormat: String;
    private Camera;
    private Cube;
    private Material;
    private Mesh;
    private Renderer;
    private Scene;
    private ViewPort;
    private MouseTracker;
    private CameraPositions;
    created(): void;
    bind(): void;
    attached(): void;
    panoramicSetPathChanged(): void;
    panoramicImageFormatChanged(): void;
    panoramicSetNameChanged(): void;
    UpdateCubeTextures(): void;
    LoadCubeTextures(): any;
    RenderLoop: () => void;
    MouseDownEvent: (event: any) => void;
    MouseMoveEvent: (event: any) => void;
    WindowResizeEvent: () => void;
}
