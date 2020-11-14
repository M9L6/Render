import mat4 from "../../../math/tsm/mat4";
import { GLAttribBits, GLAttribState } from "./GLAttribState";
import { GLTexture } from "./GLTexture";
import {
    EShaderType,
    GLAttribMap,
    GLHelper,
    GLUniformMap,
} from "./helper/GLHelper";

export const GLShaderSource = {
    colorShader: {
        vs: `
        #ifdef GL_ES
            precision highp float;
        #endif
        attribute vec3 aPosition;
        attribute vec4 aColor;
        uniform mat4 uMVPMatrix;
        varying vec4 vColor;
        void main(){
            gl_Position = uMVPMatrix*vec4(aPosition,1.0);
            vColor = aColor;
        }
        `,
        fs: `
        #ifdef GL_ES
            precision highp float;
        #endif
        varying vec4 vColor;
        void main(){
            gl_FragColor = vColor;
        }
        `,
    },
    textureShader: {
        vs: `
        #ifdef GL_ES
            precision highp float;
        #endif
        attribute vec3 aPosition;
        attribute vec2 aTexCoord;
        uniform mat4 uMVPMatrix;
        varying vec2 vTexCoord;
        void main(){
            gl_Position = uMVPMatrix*vec4(aPosition,1.0);
            vTexCoord = aTexCoord;
        }
        `,
        fs: `
        #ifdef GL_ES
            precision highp float;
        #endif
        uniform sampler2D uSampler;
        varying vec2 vTexCoord;
        void main(){
            gl_FragColor =  texture2D(uSampler,vTexCoord);
        }
        `,
    },
};

export class GLProgram {
    public static readonly MVMatrix: string = "uMVMatrix";
    public static readonly ModelMatrix: string = "uModelMatrix";
    public static readonly ViewMatrix: string = "uViewMatrix";
    public static readonly ProjectMatrix: string = "uProjectMatrix";
    public static readonly NormalMatrix: string = "uNormalMatrix";
    public static readonly MVPMatrix: string = "uMVPMatrix";
    public static readonly Color: string = "uColor";
    public static readonly Sampler: string = "uSampler";
    public static readonly DiffuseSamler: string = "uDiffuseSampler";
    public static readonly NormalSampler: string = "uNormalSampler";
    public static readonly SpecularSampelr: string = "uSpecularSampler";
    public static readonly DepthSampler: string = "uDepthSampelr";

    public static createDefaultTextureProgram(
        gl: WebGLRenderingContext
    ): GLProgram {
        return new GLProgram(
            gl,
            GLAttribState.makeVertexAttribs(true, false, false, false, false),
            GLShaderSource.textureShader.vs,
            GLShaderSource.textureShader.fs
        );
    }

    public static createDefaultColorPorgram(
        gl: WebGLRenderingContext
    ): GLProgram {
        return new GLProgram(
            gl,
            GLAttribState.makeVertexAttribs(false, false, false, false, true),
            GLShaderSource.colorShader.vs,
            GLShaderSource.colorShader.fs
        );
    }

    public gl: WebGLRenderingContext;
    public name: string;

    public program: WebGLProgram;
    public vsShader: WebGLShader;
    public fsShader: WebGLShader;

    public attribMap: GLAttribMap;
    public uniformMap: GLUniformMap;

    public bindCallback: ((program: GLProgram) => void) | null;
    public unbindCallback: ((program: GLProgram) => void) | null;

    private _attribState: GLAttribBits;

    constructor(
        context: WebGLRenderingContext,
        attribState: GLAttribBits,
        vsShader: string | null = null,
        fsShader: string | null = null,
        name: string = ""
    ) {
        this.gl = context;
        this._attribState = attribState;

        this.bindCallback = null;
        this.unbindCallback = null;

        let gl = this.gl;
        let shader: WebGLShader | null = GLHelper.createShader(
            gl,
            EShaderType.VS_SHADER
        );
        if (shader === null) throw new Error("Create Vertex Shader Fail");
        this.vsShader = shader;
        shader = GLHelper.createShader(gl, EShaderType.FS_SAHDER);
        if (shader === null) throw new Error("Create Fragment Shader Fail");
        this.fsShader = shader;
        let program: WebGLProgram | null = GLHelper.createProgram(gl);
        if (program === null) throw new Error("Create Program Fail");
        this.program = program;

        this.attribMap = {};
        this.uniformMap = {};
        if (vsShader !== null && fsShader !== null) {
            this.loadShaders(vsShader, fsShader);
        }
        this.name = name;
    }

    private programBeforeLink(
        gl: WebGLRenderingContext,
        program: WebGLProgram
    ): void {
        if (GLAttribState.hasPostion(this._attribState)) {
            gl.bindAttribLocation(
                program,
                GLAttribState.POSITION_LOCATION,
                GLAttribState.POSITION_NAME
            );
        }

        if (GLAttribState.hasNormal(this._attribState)) {
            gl.bindAttribLocation(
                program,
                GLAttribState.NORMAL_LOCATION,
                GLAttribState.NORMAL_NAME
            );
        }

        if (GLAttribState.hasTexcoord(this._attribState)) {
            gl.bindAttribLocation(
                program,
                GLAttribState.TEXCOORD_LOCATION,
                GLAttribState.TEXCOORD_NAME
            );
        }

        if (GLAttribState.hasTexcoord1(this._attribState)) {
            gl.bindAttribLocation(
                program,
                GLAttribState.TEXCOORD1_LOCATION,
                GLAttribState.TEXCOORD1_NAME
            );
        }

        if (GLAttribState.hasColor(this._attribState)) {
            gl.bindAttribLocation(
                program,
                GLAttribState.COLOR_LOCATION,
                GLAttribState.COLOR_NAME
            );
        }

        if (GLAttribState.hasTangent(this._attribState)) {
            gl.bindAttribLocation(
                program,
                GLAttribState.TANGENT_LOCATION,
                GLAttribState.TANGENT_NAME
            );
        }
    }

    private programAfterLink(
        gl: WebGLRenderingContext,
        program: WebGLProgram
    ): void {
        GLHelper.getProgramActiveAttribs(gl, program, this.attribMap);
        GLHelper.getProgramActiveUniforms(gl, program, this.uniformMap);
        console.log(JSON.stringify(this.attribMap));
        console.log(JSON.stringify(this.uniformMap));
    }

    public loadShaders(vs: string, fs: string): void {
        if (GLHelper.compileShader(this.gl, vs, this.vsShader) === false) {
            throw new Error("WEBGL Vertex Shader Compile Fail");
        }
        if (GLHelper.compileShader(this.gl, fs, this.fsShader) === false) {
            throw new Error("WEBGL Fragment Shader Compile Fail");
        }

        if (
            GLHelper.linkProgram(
                this.gl,
                this.program,
                this.vsShader,
                this.fsShader,
                this.programBeforeLink.bind(this),
                this.programAfterLink.bind(this)
            ) === false
        ) {
            console.log(this.gl.getProgramInfoLog(this.program));
            throw new Error("WEBGLProgram Link Fail");
        }
    }

    public bind(): void {
        this.gl.useProgram(this.program);
        if (this.bindCallback !== null) {
            this.bindCallback(this);
        }
    }

    public unbind(): void {
        if (this.unbindCallback !== null) {
            this.unbindCallback(this);
        }
        this.gl.useProgram(null);
    }

    public getUniformLocation(name: string): WebGLUniformLocation | null {
        return this.gl.getUniformLocation(this.program, name);
    }

    public setMatrix4(name: string, mat: mat4): boolean {
        let loc: WebGLUniformLocation | null = this.getUniformLocation(name);
        if (loc) {
            this.gl.uniformMatrix4fv(loc, false, mat.Values);
            return true;
        }
        return false;
    }

    public setTexture(name: string, unit: number): boolean {
        let loc: WebGLUniformLocation | null = this.getUniformLocation(name);
        if (loc) {
            this.gl.uniform1i(loc, unit);
            return true;
        }
        return false;
    }
}
