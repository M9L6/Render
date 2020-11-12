import { TypedArrayList } from "../../../dataStruct/TypedArrayList";
import mat4 from "../../../math/tsm/mat4";
import vec2 from "../../../math/tsm/vec2";
import vec3 from "../../../math/tsm/vec3";
import vec4 from "../../../math/tsm/vec4";
import {
    GLAttribBits,
    GLAttribOffsetMap,
    GLAttribState,
} from "./GLAttribState";
import { GLMeshBase } from "./GLMeshBase";
import { GLProgram } from "./GLProgram";

export enum EVertexLayout {
    INTERLEAVED,
    SEQUENCED,
    SEPARATED,
}

export class GLMeshBuilder extends GLMeshBase {
    private static SEQUENCED: string = "SEQUENCED";
    private static INTERLEAVED: string = "INTERLEAVED";

    private _layout: EVertexLayout;

    private _color: vec4 = new vec4([0, 0, 0, 0]);
    private _texCoord: vec2 = new vec2([0, 0]);
    private _normal: vec3 = new vec3([0, 0, 1]);
    private _hasColor: boolean;
    private _hasTexcoord: boolean;
    private _hasNormal: boolean;
    private _lists: { [key: string]: TypedArrayList<Float32Array> } = {};
    private _buffers: { [key: string]: WebGLBuffer } = {};
    private _vertCount: number = 0;
    public program: GLProgram;
    public texture: WebGLTexture | null;

    constructor(
        gl: WebGLRenderingContext,
        state: GLAttribBits,
        program: GLProgram,
        texture: WebGLTexture | null = null,
        layout: EVertexLayout = EVertexLayout.INTERLEAVED
    ) {
        super(gl, state);
        this._hasColor = GLAttribState.hasColor(state);
        this._hasNormal = GLAttribState.hasNormal(state);
        this._hasTexcoord = GLAttribState.hasTexcoord(state);

        this._layout = layout;
        this.program = program;
        this.texture = texture;
        this.bind();
        let buffer: WebGLBuffer | null = this.gl.createBuffer();
        if (buffer === null) {
            throw new Error("WebGLBuffer Create Fail");
        }
        if (this._layout === EVertexLayout.INTERLEAVED) {
            this._lists[GLMeshBuilder.INTERLEAVED] = new TypedArrayList<
                Float32Array
            >(Float32Array);
            this._buffers[GLMeshBuilder.INTERLEAVED] = buffer;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            let map: GLAttribOffsetMap = GLAttribState.getInterleavedLayoutAttribOffsetMap(
                this._attribState
            );
            GLAttribState.setAttribVertexArrayPointer(this.gl, map);
            GLAttribState.setAttribVertexArrayState(this.gl, this._attribState);
        } else if (this._layout === EVertexLayout.SEQUENCED) {
            this._lists[GLAttribState.POSITION_NAME] = new TypedArrayList<
                Float32Array
            >(Float32Array);
            if (this._hasColor) {
                this._lists[GLAttribState.COLOR_NAME] = new TypedArrayList<
                    Float32Array
                >(Float32Array);
            }
            if (this._hasTexcoord) {
                this._lists[GLAttribState.TEXCOORD_NAME] = new TypedArrayList<
                    Float32Array
                >(Float32Array);
            }
            if (this._hasNormal) {
                this._lists[GLAttribState.NORMAL_NAME] = new TypedArrayList<
                    Float32Array
                >(Float32Array);
            }
            this._buffers[GLMeshBuilder.SEQUENCED] = buffer;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            GLAttribState.setAttribVertexArrayState(this.gl, this._attribState);
        } else {
            this._lists[GLAttribState.POSITION_NAME] = new TypedArrayList<
                Float32Array
            >(Float32Array);
            this._buffers[GLAttribState.POSITION_NAME] = buffer;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            if (this._hasColor) {
                this._lists[GLAttribState.COLOR_NAME] = new TypedArrayList<
                    Float32Array
                >(Float32Array);
                buffer = this.gl.createBuffer();
                if (buffer === null) throw new Error("WebGLBuffer create fail");
                this._buffers[GLAttribState.COLOR_NAME] = buffer;
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            }
            if (this._hasTexcoord) {
                this._lists[GLAttribState.TEXCOORD_NAME] = new TypedArrayList<
                    Float32Array
                >(Float32Array);
                buffer = this.gl.createBuffer();
                if (buffer === null) throw new Error("WebGLBuffer create fail");
                this._buffers[GLAttribState.TEXCOORD_NAME] = buffer;
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            }
            if (this._hasNormal) {
                this._lists[GLAttribState.NORMAL_NAME] = new TypedArrayList<
                    Float32Array
                >(Float32Array);
                buffer = this.gl.createBuffer();
                if (buffer === null) throw new Error("WebGLBuffer create fail");
                this._buffers[GLAttribState.NORMAL_NAME] = buffer;
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            }
            let map: GLAttribOffsetMap = GLAttribState.getSepratedLayoutAttribOffsetMap(
                this._attribState
            );
            GLAttribState.setAttribVertexArrayPointer(this.gl, map);
            GLAttribState.setAttribVertexArrayState(this.gl, this._attribState);
        }
        this.unbind();
    }

    public color(r: number, g: number, b: number, a: number): GLMeshBuilder {
        if (this._hasColor) {
            this._color.r = r;
            this._color.g = g;
            this._color.b = b;
            this._color.a = a;
        }
        return this;
    }

    public normal(x: number, y: number, z: number): GLMeshBuilder {
        if (this._hasNormal) {
            this._normal.x = x;
            this._normal.y = y;
            this._normal.z = z;
        }
        return this;
    }

    public texcoord(u: number, v: number): GLMeshBuilder {
        if (this._hasTexcoord) {
            this._texCoord.x = u;
            this._texCoord.y = v;
        }
        return this;
    }

    public vertex(x: number, y: number, z: number): GLMeshBuilder {
        if (this._layout === EVertexLayout.INTERLEAVED) {
            let list: TypedArrayList<Float32Array> = this._lists[
                GLMeshBuilder.INTERLEAVED
            ];
            list.pushArray([x, y, z]);
            if (this._hasTexcoord) {
                list.pushArray(this._texCoord.xy);
            }
            if (this._hasNormal) {
                list.pushArray(this._normal.xyz);
            }
            if (this._hasColor) {
                list.pushArray(this._color.rgba);
            }
        } else {
            let list: TypedArrayList<Float32Array> = this._lists[
                GLAttribState.POSITION_NAME
            ];
            list.pushArray([x, y, z]);
            if (this._hasTexcoord) {
                list = this._lists[GLAttribState.TEXCOORD_NAME];
                list.pushArray(this._texCoord.xy);
            }
            if (this._hasNormal) {
                list = this._lists[GLAttribState.NORMAL_NAME];
                list.pushArray(this._normal.xyz);
            }
            if (this._hasColor) {
                list = this._lists[GLAttribState.COLOR_NAME];
                list.pushArray(this._color.rgba);
            }
        }
        this._vertCount++;
        return this;
    }

    public begin(drawMode: number = this.gl.TRIANGLES): GLMeshBuilder {
        this.drawMode = drawMode;
        this._vertCount = 0;
        if (this._layout === EVertexLayout.INTERLEAVED) {
            let list: TypedArrayList<Float32Array> = this._lists[
                GLMeshBuilder.INTERLEAVED
            ];
            list.clear();
        } else {
            let list: TypedArrayList<Float32Array> = this._lists[
                GLAttribState.POSITION_NAME
            ];
            list.clear();
            if (this._hasTexcoord) {
                list = this._lists[GLAttribState.TEXCOORD_NAME];
                list.clear();
            }
            if (this._hasNormal) {
                list = this._lists[GLAttribState.NORMAL_NAME];
                list.clear();
            }
            if (this._hasColor) {
                list = this._lists[GLAttribState.COLOR_NAME];
                list.clear();
            }
        }
        return this;
    }

    public end(mvp: mat4): void {
        this.program.bind();
        this.program.setMatrix4(GLProgram.MVPMatrix, mvp);
        this.bind();
        if (this._layout === EVertexLayout.INTERLEAVED) {
            let list: TypedArrayList<Float32Array> = this._lists[
                GLMeshBuilder.INTERLEAVED
            ];
            let buffer: WebGLBuffer = this._buffers[GLMeshBuilder.INTERLEAVED];
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            this.gl.bufferData(
                this.gl.ARRAY_BUFFER,
                list.subArray(),
                this.gl.DYNAMIC_DRAW
            );
        } else if (this._layout === EVertexLayout.SEQUENCED) {
            let buffer: WebGLBuffer = this._buffers[GLMeshBuilder.SEQUENCED];
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            this.gl.bufferData(
                this.gl.ARRAY_BUFFER,
                this._attribStride * this._vertCount,
                this.gl.DYNAMIC_DRAW
            );
            let map: GLAttribOffsetMap = GLAttribState.getSequencedLayoutAttribOffsetMap(
                this._attribState,
                this._vertCount
            );
            let list: TypedArrayList<Float32Array> = this._lists[
                GLAttribState.POSITION_NAME
            ];
            this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, list.subArray());
            if (this._hasTexcoord) {
                list = this._lists[GLAttribState.TEXCOORD_NAME];
                this.gl.bufferSubData(
                    this.gl.ARRAY_BUFFER,
                    map[GLAttribState.TEXCOORD_NAME],
                    list.subArray()
                );
            }
            if (this._hasNormal) {
                list = this._lists[GLAttribState.NORMAL_NAME];
                this.gl.bufferSubData(
                    this.gl.ARRAY_BUFFER,
                    map[GLAttribState.NORMAL_NAME],
                    list.subArray()
                );
            }
            if (this._hasColor) {
                list = this._lists[GLAttribState.COLOR_NAME];
                this.gl.bufferSubData(
                    this.gl.ARRAY_BUFFER,
                    map[GLAttribState.COLOR_NAME],
                    list.subArray()
                );
            }
            GLAttribState.setAttribVertexArrayPointer(this.gl, map);
        } else {
            let buffer: WebGLBuffer = this._buffers[
                GLAttribState.POSITION_NAME
            ];
            let list: TypedArrayList<Float32Array> = this._lists[
                GLAttribState.POSITION_NAME
            ];
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            this.gl.bufferData(
                this.gl.ARRAY_BUFFER,
                list.subArray(),
                this.gl.DYNAMIC_DRAW
            );
            if (this._hasTexcoord) {
                buffer = this._buffers[GLAttribState.TEXCOORD_NAME];
                list = this._lists[GLAttribState.TEXCOORD_NAME];
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
                this.gl.bufferData(
                    this.gl.ARRAY_BUFFER,
                    list.subArray(),
                    this.gl.DYNAMIC_DRAW
                );
            }
            if (this._hasNormal) {
                buffer = this._buffers[GLAttribState.NORMAL_NAME];
                list = this._lists[GLAttribState.NORMAL_NAME];
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
                this.gl.bufferData(
                    this.gl.ARRAY_BUFFER,
                    list.subArray(),
                    this.gl.DYNAMIC_DRAW
                );
            }
            if (this._hasColor) {
                buffer = this._buffers[GLAttribState.COLOR_NAME];
                list = this._lists[GLAttribState.COLOR_NAME];
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
                this.gl.bufferData(
                    this.gl.ARRAY_BUFFER,
                    list.subArray(),
                    this.gl.DYNAMIC_DRAW
                );
            }
        }
        this.gl.drawArrays(this.drawMode, 0, this._vertCount);
        this.unbind();
        this.program.unbind();
    }
}
