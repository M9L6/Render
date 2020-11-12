import { Camera } from "./render/gl/objects/Camera";
import { WebGLApplication } from "./WebGLApplication";

export class CamerApplication extends WebGLApplication {
    public camera: Camera;

    constructor(
        canvas: HTMLCanvasElement,
        contextAttributes?: WebGLContextAttributes
    ) {
        super(canvas, contextAttributes);
        this.camera = new Camera(
            this.gl as WebGLRenderingContext,
            this.canvas.width,
            this.canvas.height
        );
    }
}
