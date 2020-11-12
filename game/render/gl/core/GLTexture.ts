import { Math2D } from "../../../math/Math2D";
import { GLHelper } from "./helper/GLHelper";

export enum EGLTexWrapType {
    GL_CLAMP_TO_EDGE,
    GL_REPEAT,
    GL_MIRRORED_REPEAT,
}

export class GLTexture {
    public static isPowerOfTwo(x: number): boolean {
        return ((x - 1) & x) === 0;
    }

    public static getNextPowerofTwo(x: number): number {
        if (x <= 0) throw new Error("必须大于0");
        --x;
        for (var i = 1; i < 32; i <<= 1) {
            x = x | (x >> i);
        }
        return x + 1;
    }

    public static createPowerOfTwoCanvas(
        source: HTMLImageElement | HTMLCanvasElement
    ): HTMLCanvasElement {
        let canvas: HTMLCanvasElement = document.createElement("canvas");
        canvas.width = GLTexture.getNextPowerofTwo(source.width);
        canvas.height = GLTexture.getNextPowerofTwo(source.height);
        let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
        if (ctx === null) {
            throw new Error("create canvasrenderingcontext2d fail");
        }
        ctx.drawImage(
            source,
            0,
            0,
            source.width,
            source.height,
            0,
            0,
            canvas.width,
            canvas.height
        );
        return canvas;
    }

    public static createDefaultTexture(gl: WebGLRenderingContext): GLTexture {
        let step: number = 4;
        let canvas: HTMLCanvasElement = document.createElement("canvas");
        canvas.width = 32 * step;
        canvas.height = 32 * step;
        let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
        if (ctx === null) {
            throw new Error("create canvasrenderingcontext2d fail");
        }
        for (let i = 0; i < step; i++) {
            for (let j: number = 0; j < step; j++) {
                let idx: number = step * i + j;
                ctx.save();
                ctx.fillStyle = Math2D.Colors[idx];
                ctx.fillRect(i * 32, j * 32, 32, 32);
                ctx.restore();
            }
        }
        let tex: GLTexture = new GLTexture(gl);
        tex.wrap();
        tex.upload(canvas);
        return tex;
    }

    public gl: WebGLRenderingContext;
    public isMipmap: boolean;
    public width: number;
    public height: number;
    public format: number;

    public type: number;
    public texture: WebGLTexture;
    public target: number;
    public name: string;

    constructor(gl: WebGLRenderingContext, name: string = "") {
        this.gl = gl;
        this.isMipmap = false;
        this.width = this.height = 0;
        this.format = gl.RGBA;
        this.type = gl.UNSIGNED_BYTE;
        let tex: WebGLTexture | null = gl.createTexture();
        if (tex === null) throw new Error("webgltexture create fail");
        this.texture = tex;
        this.target = gl.TEXTURE_2D;
        this.name = name;
    }

    public upload(
        source: HTMLImageElement | HTMLCanvasElement,
        unit: number = 0,
        mipmap: boolean = false
    ): void {
        this.bind(unit);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
        this.width = source.width;
        this.height = source.height;
        if (mipmap === true) {
            let isWidthPowerOfTwo: boolean = GLTexture.isPowerOfTwo(this.width),
                isHeightPowerOfTwo: boolean = GLTexture.isPowerOfTwo(
                    this.height
                );
            if (isWidthPowerOfTwo && isHeightPowerOfTwo) {
                this.gl.texImage2D(
                    this.target,
                    0,
                    this.format,
                    this.format,
                    this.type,
                    source
                );
                this.gl.generateMipmap(this.target);
            } else {
                let canvas: HTMLCanvasElement = GLTexture.createPowerOfTwoCanvas(
                    source
                );
                this.gl.texImage2D(
                    this.target,
                    0,
                    this.format,
                    this.format,
                    this.type,
                    canvas
                );
                GLHelper.checkGLError(this.gl);
                this.gl.generateMipmap(this.target);
                GLHelper.checkGLError(this.gl);
                this.width = canvas.width;
                this.height = canvas.height;
            }
            this.isMipmap = true;
        } else {
            this.isMipmap = false;
            this.gl.texImage2D(
                this.target,
                0,
                this.format,
                this.format,
                this.type,
                source
            );
        }
        this.unbind();
    }

    public wrap(mode: EGLTexWrapType = EGLTexWrapType.GL_REPEAT): void {
        this.gl.bindTexture(this.target, this.texture);
        if (mode === EGLTexWrapType.GL_CLAMP_TO_EDGE) {
            this.gl.texParameteri(
                this.target,
                this.gl.TEXTURE_WRAP_S,
                this.gl.CLAMP_TO_EDGE
            );
            this.gl.texParameteri(
                this.target,
                this.gl.TEXTURE_WRAP_T,
                this.gl.CLAMP_TO_EDGE
            );
        } else if (mode === EGLTexWrapType.GL_REPEAT) {
            this.gl.texParameteri(
                this.target,
                this.gl.TEXTURE_WRAP_S,
                this.gl.REPEAT
            );
            this.gl.texParameteri(
                this.target,
                this.gl.TEXTURE_WRAP_T,
                this.gl.REPEAT
            );
        } else {
            this.gl.texParameteri(
                this.target,
                this.gl.TEXTURE_WRAP_S,
                this.gl.MIRRORED_REPEAT
            );
            this.gl.texParameteri(
                this.target,
                this.gl.TEXTURE_WRAP_T,
                this.gl.MIRRORED_REPEAT
            );
        }
    }

    public filter(minLinear: boolean = true, magLinear: boolean = true): void {
        this.gl.bindTexture(this.target, this.texture);
        if (this.isMipmap) {
            this.gl.texParameteri(
                this.target,
                this.gl.TEXTURE_MIN_FILTER,
                minLinear
                    ? this.gl.LINEAR_MIPMAP_LINEAR
                    : this.gl.NEAREST_MIPMAP_NEAREST
            );
        } else {
            this.gl.texParameteri(
                this.target,
                this.gl.TEXTURE_MIN_FILTER,
                minLinear ? this.gl.LINEAR : this.gl.NEAREST
            );
        }
        this.gl.texParameteri(
            this.target,
            this.gl.TEXTURE_MAG_FILTER,
            magLinear ? this.gl.LINEAR : this.gl.NEAREST
        );
    }

    public bind(unit: number): void {
        if (this.texture !== null) {
            this.gl.activeTexture(this.gl.TEXTURE0 + unit);
            this.gl.bindTexture(this.target, this.texture);
        }
    }

    public unbind(): void {
        if (this.texture !== null) {
            this.gl.bindTexture(this.target, null);
        }
    }
}
