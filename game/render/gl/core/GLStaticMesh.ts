import {
    GLAttribBits,
    GLAttribOffsetMap,
    GLAttribState,
} from "./GLAttribState";
import { GLMeshBase } from "./GLMeshBase";

export class GLStaticMesh extends GLMeshBase {
    protected _vbo: WebGLBuffer;
    protected _vertexCount: number;
    protected _ibo: WebGLBuffer | null = null;
    protected _indexCount: number = 0;

    constructor(
        gl: WebGLRenderingContext,
        attribState: GLAttribBits,
        vbo: Float32Array | ArrayBuffer,
        ibo: Uint16Array | null = null,
        drawMode: number = gl.TRIANGLES
    ) {
        super(gl, attribState, drawMode);
        this.bind();
        let vb: WebGLBuffer | null = gl.createBuffer();
        if (vb === null) {
            throw new Error("vbo create fail");
        }
        this._vbo = vb;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._vbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vbo, this.gl.STATIC_DRAW);
        let offsetMap: GLAttribOffsetMap = GLAttribState.getInterleavedLayoutAttribOffsetMap(
            this._attribState
        );
        this._vertexCount =
            vbo.byteLength / offsetMap[GLAttribState.ATTRIBSTRIDE];
        GLAttribState.setAttribVertexArrayPointer(this.gl, offsetMap);
        GLAttribState.setAttribVertexArrayState(this.gl, this._attribState);
        this.setIBO(ibo);
        this.unbind();
    }

    protected setIBO(ibo: Uint16Array | null): void {
        if (ibo === null) return;
        if (this._ibo === null) {
            throw new Error("IBO create fail");
        }
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this._ibo);
        this.gl.bufferData(
            this.gl.ELEMENT_ARRAY_BUFFER,
            ibo,
            this.gl.STATIC_DRAW
        );
        this._indexCount = ibo.length;
    }

    public draw(): void {
        this.bind();
        if (this._ibo !== null) {
            this.gl.drawElements(
                this.drawMode,
                this._indexCount,
                this.gl.UNSIGNED_SHORT,
                0
            );
        } else {
            this.gl.drawArrays(this.drawMode, 0, this._vertexCount);
        }
        this.unbind();
    }

    public drawRange(offset: number, count: number): void {
        if (this._ibo !== null) {
            this.gl.drawElements(
                this.drawMode,
                count,
                this.gl.UNSIGNED_SHORT,
                offset
            );
        } else {
            this.gl.drawArrays(this.drawMode, offset, count);
        }
    }
}
