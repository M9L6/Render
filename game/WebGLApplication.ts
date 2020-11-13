import { Application } from "./Application";
import { GLProgram } from "./render/gl/core/GLProgram";
import { GLProgramCache } from "./render/gl/core/GLProgramCache";
import { GLTexture } from "./render/gl/core/GLTexture";
import { GLTextureCache } from "./render/gl/core/GLTextureCache";

export class WebGLApplication extends Application {
    public gl: WebGLRenderingContext;
    constructor(
        canvas: HTMLCanvasElement,
        contextAttributes?: WebGLContextAttributes
    ) {
        super(canvas);
        let gl: WebGLRenderingContext | null = canvas.getContext(
            "webgl",
            contextAttributes
        );
        if (gl === null) {
            alert("无法创建WebGLRenderingContext上下文对象 ");
            throw new Error("无法创建WebGLRenderingContext上下文对象 ");
        }
        this.gl = gl;
        this._init();
    }

    private _init(): void {
        this._initTextures();
        this._intiShaders();
    }

    private _initTextures() {
        GLTextureCache.instance.set(
            "default",
            GLTexture.createDefaultTexture(this.gl)
        );
    }

    private _intiShaders() {
        GLProgramCache.instance.set(
            "color",
            GLProgram.createDefaultColorPorgram(this.gl)
        );
        GLProgramCache.instance.set(
            "texture",
            GLProgram.createDefaultTextureProgram(this.gl)
        );
    }
}
