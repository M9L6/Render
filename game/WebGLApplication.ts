import { Application } from "./Application";
import { GLProgram } from "./render/gl/core/GLProgram";
import { GLProgramCache } from "./render/gl/core/GLProgramCache";

export class WebGLApplication extends Application {
    public gl: WebGLRenderingContext | null;
    constructor(
        canvas: HTMLCanvasElement,
        contextAttributes?: WebGLContextAttributes
    ) {
        super(canvas);
        this.gl = canvas.getContext("webgl", contextAttributes);
        if (this.gl === null) {
            alert("无法创建WebGLRenderingContext上下文对象 ");
            throw new Error("无法创建WebGLRenderingContext上下文对象 ");
        }
        this._intiShaders();
    }

    private _intiShaders() {
        GLProgramCache.instance.set(
            "color",
            GLProgram.createDefaultColorPorgram(
                this.gl as WebGLRenderingContext
            )
        );
        GLProgramCache.instance.set(
            "texture",
            GLProgram.createDefaultTextureProgram(
                this.gl as WebGLRenderingContext
            )
        );
    }
}
