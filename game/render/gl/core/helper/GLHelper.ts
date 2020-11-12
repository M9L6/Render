import { GLAttribInfo } from "../GLAttribInfo";
import { GLUniformInfo } from "../GLUniformInfo";

export type GLAttribMap = { [key: string]: GLAttribInfo };
export type GLUniformMap = { [key: string]: GLUniformInfo };

export enum EShaderType {
    VS_SHADER,
    FS_SAHDER,
}

export enum EGLSLESDataType {
    FLOAT_VEC2 = 0x8b50,
    FLOAT_VEC3,
    FLOAT_VEC4,
    INT_VEC2,
    INT_VEC3,
    INT_VEC4,
    BOOL,
    BOOL_VEC2,
    BOOL_VEC3,
    BOOL_VEC4,
    FLOAT_MAT2,
    FLOAT_MAT3,
    FLOAT_MAT4,
    SAMPLER_2D,
    SAMPLER_CUBE,
    FLOAT = 0x1406,
    INT = 0x1404,
}

export class GLHelper {
    public static printStates(gl: WebGLRenderingContext | null): void {
        if (gl === null) return;
        console.log(`
        isBlendEnable = ${gl.isEnabled(gl.BLEND)}
        isCullFaceEnable = ${gl.isEnabled(gl.CULL_FACE)}
        isDepthTestEnable = ${gl.isEnabled(gl.DEPTH_TEST)}
        isDitherEnable = ${gl.isEnabled(gl.DITHER)}
        isPolygonOffsetFillEnable = ${gl.isEnabled(gl.POLYGON_OFFSET_FILL)}
        isSampleAlphaToCoverageEnable = ${gl.isEnabled(
            gl.SAMPLE_ALPHA_TO_COVERAGE
        )} 
        isSampleCoverageEnable = ${gl.isEnabled(gl.SAMPLE_COVERAGE)}
        isScissorTestEnable = ${gl.isEnabled(gl.SCISSOR_TEST)}
        isStencilTestEnable = ${gl.isEnabled(gl.STENCIL_TEST)}
        `);
    }

    public static triggerContextLostEvent(gl: WebGLRenderingContext): void {
        let ret: WEBGL_lose_context | null = gl.getExtension(
            "WEBGL_lose_context"
        );
        if (ret !== null) {
            ret.loseContext();
        }
    }

    public static printWebGLInfo(gl: WebGLRenderingContext): void {
        console.log(`
        renderer = ${gl.getParameter(gl.RENDERER)}
        version = ${gl.getParameter(gl.VERSION)}
        vendor = ${gl.getParameter(gl.VENDOR)}
        glsl version = ${gl.getParameter(gl.SHADING_LANGUAGE_VERSION)}
        `);
    }

    public static checkGLError(gl: WebGLRenderingContext): void {
        let error: number = gl.getError();
        switch (error) {
            case gl.INVALID_ENUM:
                throw new Error(
                    "An unacceptable value has been specified for an enumerated argument. The command is ignored and the error flag is set"
                );
            case gl.INVALID_OPERATION:
                throw new Error(
                    "The specified command is not allowed for the current state. The command is ignored and the error flag is set."
                );
            case gl.INVALID_VALUE:
                throw new Error(
                    "A numeric argument is out of range. The command is ignored and the error flag is set."
                );
            case gl.INVALID_FRAMEBUFFER_OPERATION:
                throw new Error("use invalid framebuffer operation");
            case gl.OUT_OF_MEMORY:
                throw new Error(
                    "Not enough memory is left to execute the command."
                );
            case gl.CONTEXT_LOST_WEBGL:
                throw new Error(
                    "If the WebGL context is lost, this error is returned on the first call to getError. Afterwards and until the context has been restored, it returns gl.NO_ERROR."
                );
        }
    }

    public static createShader(
        gl: WebGLRenderingContext,
        type: EShaderType
    ): WebGLShader {
        let shader: WebGLShader | null = null;
        if (type === EShaderType.VS_SHADER) {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        }
        if (shader === null) {
            throw new Error("shader创建失败");
        }
        return shader;
    }

    public static compileShader(
        gl: WebGLRenderingContext,
        code: string,
        shader: WebGLShader
    ): boolean {
        gl.shaderSource(shader, code);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === false) {
            alert(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return false;
        }
        return true;
    }

    public static createProgram(gl: WebGLRenderingContext): WebGLProgram {
        let program: WebGLProgram | null = gl.createProgram();
        if (program === null) {
            throw new Error("WebGLProgram创建失败");
        }
        return program;
    }

    public static linkProgram(
        gl: WebGLRenderingContext,
        program: WebGLProgram,
        vsShader: WebGLShader,
        fsShader: WebGLShader,
        beforeProgramLink:
            | ((gl: WebGLRenderingContext, program: WebGLProgram) => void)
            | null = null,
        afterProgramLink:
            | ((gl: WebGLRenderingContext, program: WebGLProgram) => void)
            | null = null
    ): boolean {
        gl.attachShader(program, vsShader);
        gl.attachShader(program, fsShader);
        if (beforeProgramLink !== null) beforeProgramLink(gl, program);
        gl.linkProgram(program);
        if (gl.getProgramParameter(program, gl.LINK_STATUS) === false) {
            alert(gl.getProgramInfoLog(program));
            gl.detachShader(program, vsShader);
            gl.detachShader(program, fsShader);
            gl.deleteShader(vsShader);
            gl.deleteShader(fsShader);
            gl.deleteProgram(program);
            return false;
        }
        if (afterProgramLink !== null) afterProgramLink(gl, program);
        return true;
    }

    public static getProgramActiveAttribs(
        gl: WebGLRenderingContext,
        program: WebGLProgram,
        out: GLAttribMap
    ): void {
        let attributesCount: number = gl.getProgramParameter(
            program,
            gl.ACTIVE_ATTRIBUTES
        );
        for (let i = 0; i < attributesCount; i++) {
            let info: WebGLActiveInfo | null = gl.getActiveAttrib(program, i);
            if (info) {
                out[info.name] = new GLAttribInfo(
                    info.size,
                    info.type,
                    gl.getAttribLocation(program, info.name)
                );
            }
        }
    }

    public static getProgramActiveUniforms(
        gl: WebGLRenderingContext,
        program: WebGLProgram,
        out: GLUniformMap
    ): void {
        let uniformCount: number = gl.getProgramParameter(
            program,
            gl.ACTIVE_UNIFORMS
        );
        for (let i = 0; i < uniformCount; i++) {
            let info: WebGLActiveInfo | null = gl.getActiveUniform(program, i);
            if (info) {
                let loc: WebGLUniformLocation | null = gl.getUniformLocation(
                    program,
                    info.name
                );
                if (loc) {
                    out[info.name] = new GLUniformInfo(
                        info.size,
                        info.type,
                        loc
                    );
                }
            }
        }
    }

    public static createBuffer(gl: WebGLRenderingContext): WebGLBuffer {
        let buffer: WebGLBuffer | null = gl.createBuffer();
        if (buffer === null) {
            throw new Error("WebGLBuffer创建失败");
        }
        return buffer;
    }
}
