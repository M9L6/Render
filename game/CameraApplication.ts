import { CanvasKeyBoardEvent } from "./input/CanvasKeyBoardEvent";
import { GLWorldMatrixStack } from "./math/GLWorldMatrixStack";
import vec3 from "./math/tsm/vec3";
import { Camera } from "./render/gl/objects/Camera";
import { WebGLApplication } from "./WebGLApplication";

export class CamerApplication extends WebGLApplication {
    public camera: Camera;
    public matStack: GLWorldMatrixStack;
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
        this.camera.lookAt(new vec3([0, 0, 0]));
        this.matStack = new GLWorldMatrixStack();
    }

    protected dispatchKeyPress(evt: CanvasKeyBoardEvent): void {
        super.dispatchKeyPress(evt);
        this.onKeyPress(evt);
    }

    public onKeyPress(evt: CanvasKeyBoardEvent): void {
        if (evt.key === "w") {
            this.camera.moveForward(-1);
        } else if (evt.key === "a") {
            this.camera.moveRightward(-1);
        } else if (evt.key === "s") {
            this.camera.moveForward(1);
        } else if (evt.key === "d") {
            this.camera.moveRightward(1);
        } else if (evt.key === "q") {
            this.camera.yaw(-1);
        } else if (evt.key === "e") {
            this.camera.yaw(1);
        }
    }

    public update(elapsedMsec: number, intervalSec: number): void {
        this.camera.update(intervalSec);
    }
}
