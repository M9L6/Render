import { Application } from "../game/Application";
import { TypedArrayList } from "../game/dataStruct/TypedArrayList";
import { EShaderType, GLHelper } from "../game/helper/GLHelper";
import { CanvasMouseEvent } from "../game/input/CanvasMouseEvent";
import { Math2D } from "../game/math/Math2D";
import mat4 from "../game/math/tsm/mat4";
import vec3 from "../game/math/tsm/vec3";
import vec4 from "../game/math/tsm/vec4";

export class BasicWebGLApplication extends Application {
    public gl: WebGLRenderingContext;

    public projectMatrix: mat4;
    public viewMatrix: mat4;
    public viewProjectMatrix: mat4;

    public program: WebGLProgram;
    public vsShader: WebGLShader;
    public fsShader: WebGLShader;
    public colorShader_vs: string = `
        attribute mediump vec3 aPosition;
        attribute mediump vec4 aColor;
        uniform mediump mat4 uMVPMatrix;
        varying lowp vec4 vColor;
        void main(){
            gl_Position = uMVPMatrix*vec4(aPosition,1.0);
            gl_PointSize = 5.0;
            vColor = aColor;
        }
    `;
    public colorShader_fs: string = `
        varying lowp vec4 vColor;
        void main(){
            gl_FragColor = vColor;
        }
    `;

    public attribMap: any = {};
    public uniformMap: any = {};

    public verts: TypedArrayList<Float32Array>;
    public ivbo: WebGLBuffer;

    public indices: TypedArrayList<Uint16Array>;
    public evbo: WebGLBuffer;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        canvas.addEventListener(
            "webglcontextlost",
            function (e) {
                console.log(JSON.stringify(e));
            },
            false
        );
        let contextAttribs: WebGLContextAttributes = {
            depth: true,
            stencil: true,
            alpha: true,
            premultipliedAlpha: true,
            antialias: true,
            preserveDrawingBuffer: false,
        };
        let ctx: WebGLRenderingContext | null = this.canvas.getContext(
            "webgl",
            contextAttribs
        );
        if (ctx === null) {
            alert("无法创建WebGLRenderingContext上下文对象");
            throw new Error("无法创建WebGLRenderingContext上下文对象");
        }
        this.gl = ctx;

        this.projectMatrix = mat4.perspective(
            45,
            this.canvas.width / this.canvas.height,
            0.1,
            100
        );
        this.viewMatrix = mat4.lookAt(new vec3([0, 0, 5]), new vec3());
        this.viewProjectMatrix = mat4.product(
            this.projectMatrix,
            this.viewMatrix
        );
        console.log(
            this.viewProjectMatrix.multiplyVec4(new vec4([0.5, 0.5, 0, 1]))
        );
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.scissor(0, 0, this.canvas.width, this.canvas.height);
        this.gl.enable(this.gl.SCISSOR_TEST);

        this.vsShader = GLHelper.createShader(this.gl, EShaderType.VS_SHADER);
        GLHelper.compileShader(this.gl, this.colorShader_vs, this.vsShader);
        this.fsShader = GLHelper.createShader(this.gl, EShaderType.FS_SAHDER);
        GLHelper.compileShader(this.gl, this.colorShader_fs, this.fsShader);

        this.program = GLHelper.createProgram(this.gl);
        if (
            GLHelper.linkProgram(
                this.gl,
                this.program,
                this.vsShader,
                this.fsShader,
                this.printProgramActiveInfos.bind(this),
                this.printProgramActiveInfos.bind(this)
            )
        ) {
            this.printProgramActiveInfos();
        }

        this.ivbo = GLHelper.createBuffer(this.gl);
        this.verts = new TypedArrayList(Float32Array, 6 * 7);

        this.indices = new TypedArrayList(Uint16Array, 6);
        this.evbo = GLHelper.createBuffer(this.gl);

        // this.drawRetcByInterLeavedVBO(0, 3);
        // this.drawRetcByInterLeavedVBO(3, 3);
        this.drawRectByInterLeavedVBOWithEBO(0, 6);
    }

    public drawRectByInterLeavedVBOWithEBO(
        byteOffset: number,
        count: number,
        mode: number = this.gl.TRIANGLES
    ): void {
        this.verts.clear();
        this.verts.pushArray([
            -0.5,
            -0.5,
            0,
            1,
            0,
            0,
            1,
            0.5,
            -0.5,
            0,
            0,
            1,
            0,
            1,
            0.5,
            0.5,
            0,
            0,
            0,
            1,
            0,
            -0.5,
            0.5,
            0,
            0,
            1,
            0,
            1,
        ]);

        this.indices.clear();
        if (mode === this.gl.TRIANGLES || mode === this.gl.TRIANGLE_FAN) {
            this.indices.pushArray([0, 1, 2, 0, 2, 3]);
        } else if (mode === this.gl.TRIANGLE_STRIP) {
            this.indices.pushArray([0, 1, 2, 2, 3, 0]);
        } else {
            return;
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.ivbo);
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            this.verts.subArray(),
            this.gl.DYNAMIC_DRAW
        );

        this.gl.vertexAttribPointer(
            this.attribMap["aPosition"].location,
            3,
            this.gl.FLOAT,
            false,
            Float32Array.BYTES_PER_ELEMENT * 7,
            0
        );
        this.gl.vertexAttribPointer(
            this.attribMap["aColor"].location,
            4,
            this.gl.FLOAT,
            false,
            Float32Array.BYTES_PER_ELEMENT * 7,
            12
        );
        this.gl.enableVertexAttribArray(this.attribMap["aPosition"].location);
        this.gl.enableVertexAttribArray(this.attribMap["aColor"].location);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.evbo);
        this.gl.bufferData(
            this.gl.ELEMENT_ARRAY_BUFFER,
            this.indices.subArray(),
            this.gl.DYNAMIC_DRAW
        );
        this.gl.useProgram(this.program);
        let mat: mat4 = new mat4().setIdentity().scale(new vec3([2, 2, 2]));
        mat4.product(this.viewProjectMatrix, mat, mat);
        this.gl.uniformMatrix4fv(
            this.uniformMap["uMVPMatrix"].location,
            false,
            mat.Values
        );
        this.gl.drawElements(mode, count, this.gl.UNSIGNED_SHORT, byteOffset);

        this.gl.useProgram(null);
        this.gl.disableVertexAttribArray(this.attribMap["aPostion"]);
        this.gl.disableVertexAttribArray(this.attribMap["aColor"]);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }

    public drawRetcByInterLeavedVBO(
        first: number,
        count: number,
        mode: number = this.gl.TRIANGLES
    ): void {
        this.verts.clear();
        let data: number[];
        this.verts.clear();
        if (mode === this.gl.TRIANGLES) {
            data = [
                -0.5,
                -0.5,
                0,
                1,
                0,
                0,
                1,

                0.5,
                -0.5,
                0,
                0,
                1,
                0,
                1,

                0.5,
                0.5,
                0,
                0,
                0,
                1,
                0,

                0.5,
                0.5,
                0,
                0,
                0,
                1,
                0,

                -0.5,
                0.5,
                0,
                0,
                1,
                0,
                1,

                -0.5,
                -0.5,
                0,
                1,
                0,
                0,
                1,
            ];
        } else {
            data = [
                -0.5,
                -0.5,
                0,
                1,
                0,
                0,
                1,

                0.5,
                -0.5,
                0,
                0,
                1,
                0,
                1,

                0.5,
                0.5,
                0,
                0,
                0,
                1,
                0,

                -0.5,
                0.5,
                0,
                0,
                1,
                0,
                1,
            ];
        }

        this.verts.pushArray(data);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.ivbo);
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            this.verts.subArray(),
            this.gl.DYNAMIC_DRAW
        );
        this.gl.vertexAttribPointer(
            this.attribMap["aPosition"].location,
            3,
            this.gl.FLOAT,
            false,
            Float32Array.BYTES_PER_ELEMENT * 7,
            0
        );
        this.gl.vertexAttribPointer(
            this.attribMap["aColor"].location,
            4,
            this.gl.FLOAT,
            false,
            Float32Array.BYTES_PER_ELEMENT * 7,
            12
        );
        this.gl.enableVertexAttribArray(this.attribMap["aPosition"].location);
        this.gl.enableVertexAttribArray(this.attribMap["aColor"].location);
        this.gl.useProgram(this.program);
        this.gl.uniformMatrix4fv(
            this.uniformMap["uMVPMatrix"].location,
            false,
            this.viewProjectMatrix.Values
        );
        this.gl.drawArrays(mode, first, count);
        this.gl.useProgram(null);
        this.gl.disableVertexAttribArray(this.attribMap["aPostion"]);
        this.gl.disableVertexAttribArray(this.attribMap["aColor"]);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }

    public printProgramActiveInfos(): void {
        GLHelper.getProgramActiveAttribs(this.gl, this.program, this.attribMap);
        GLHelper.getProgramActiveUniforms(
            this.gl,
            this.program,
            this.uniformMap
        );
        console.log(`
        attribMap: ${JSON.stringify(this.attribMap)}
        uniforms: ${JSON.stringify(this.uniformMap)}
        `);
    }
}
