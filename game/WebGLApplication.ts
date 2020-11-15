import { Application } from "./Application";
import { GLProgram } from "./render/gl/core/GLProgram";
import { GLProgramCache } from "./render/gl/core/GLProgramCache";
import { GLTexture } from "./render/gl/core/GLTexture";
import { GLTextureCache } from "./render/gl/core/GLTextureCache";

export class WebGLApplication extends Application {
    public gl: WebGLRenderingContext;

    protected canvas2D: HTMLCanvasElement | null = null;
    protected ctx2D: CanvasRenderingContext2D | null = null;
    constructor(
        canvas: HTMLCanvasElement,
        contextAttributes?: WebGLContextAttributes,
        need2D: boolean = false
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
        if (need2D === true) {
            let canvasElem: HTMLCanvasElement = document.createElement(
                "canvas"
            ) as HTMLCanvasElement;
            canvasElem.width = this.canvas.width;
            canvasElem.height = this.canvas.height;
            canvasElem.style.backgroundColor = "transparent";
            canvasElem.style.position = "absolute";
            canvasElem.style.left = "0px";
            canvasElem.style.top = "0px";

            let parent: HTMLElement | null = this.canvas.parentElement;
            if (parent === null) {
                throw new Error("canvas元素必须要有父亲!!");
            }

            parent.appendChild(canvasElem);

            this.ctx2D = canvasElem.getContext("2d");

            canvasElem.addEventListener("mousedown", this, false);
            canvasElem.addEventListener("mouseup", this, false);
            canvasElem.addEventListener("mousemove", this, false);

            this.canvas.removeEventListener("mousedown", this);
            this.canvas.removeEventListener("mouseup", this);
            this.canvas.removeEventListener("mousemove", this);

            this.canvas2D = canvasElem;
        }
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
