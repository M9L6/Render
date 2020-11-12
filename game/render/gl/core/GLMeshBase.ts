import { GLAttribBits, GLAttribState } from "./GLAttribState";

export abstract class GLMeshBase {
    public gl: WebGLRenderingContext;

    public drawMode: number;

    protected _attribState: GLAttribBits;
    protected _attribStride: number;
    protected _vao: OES_vertex_array_object;
    protected _vaoTarget: WebGLVertexArrayObjectOES;

    public get vertexStride(): number {
        return this._attribStride;
    }

    constructor(
        gl: WebGLRenderingContext,
        attribState: GLAttribBits,
        drawMode: number = gl.TRIANGLES
    ) {
        this.gl = gl;
        let vao: OES_vertex_array_object | null = this.gl.getExtension(
            "OES_vertex_array_object"
        );
        if (vao === null) {
            throw new Error("Not Support OES_vertex_array_object");
        }
        this._vao = vao;
        let vaoTarget: WebGLVertexArrayObjectOES | null = this._vao.createVertexArrayOES();
        if (vaoTarget === null) {
            throw new Error("Not Support WebGLVertexArrayObjectOES");
        }
        this._vaoTarget = vaoTarget;
        this._attribState = attribState;
        this._attribStride = GLAttribState.getVertexByteStride(
            this._attribState
        );
        this.drawMode = drawMode;
    }

    public bind(): void {
        this._vao.bindVertexArrayOES(this._vaoTarget);
    }

    public unbind(): void {
        this._vao.bindVertexArrayOES(null);
    }
}
