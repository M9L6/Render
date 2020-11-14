import { CamerApplication } from "../game/CameraApplication";
import { CanvasKeyBoardEvent } from "../game/input/CanvasKeyBoardEvent";
import mat4 from "../game/math/tsm/mat4";
import vec3 from "../game/math/tsm/vec3";
import { GLAttribState } from "../game/render/gl/core/GLAttribState";
import {
    EVertexLayout,
    GLMeshBuilder,
} from "../game/render/gl/core/GLMeshBuilder";
import { GLProgram } from "../game/render/gl/core/GLProgram";
import { GLProgramCache } from "../game/render/gl/core/GLProgramCache";
import { GLTexture } from "../game/render/gl/core/GLTexture";
import { GLTextureCache } from "../game/render/gl/core/GLTextureCache";
import { DrawHelper } from "../game/render/gl/core/helper/DrawHelper";
import { GLCoordSystem } from "../game/render/gl/core/helper/GLCoordSystem";

const mat: mat4 = new mat4();

export class MeshBuilderApplication extends CamerApplication {
    public static setDefaultState(gl: WebGLRenderingContext): void {
        gl.clearColor(0, 0, 0, 0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        // gl.enable(gl.SCISSOR_TEST);
    }

    public texture: GLTexture;
    public colorShader: GLProgram;
    public texShader: GLProgram;

    public builder0: GLMeshBuilder;
    public builder1: GLMeshBuilder;
    public builder2: GLMeshBuilder;

    public tbuilder0: GLMeshBuilder;
    public tbuilder1: GLMeshBuilder;
    public tbuilder2: GLMeshBuilder;

    public angle: number = 0;
    public coords: GLCoordSystem[];
    public currentDrawMethod: () => void;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.texture = GLTextureCache.instance.getMust("default");
        this.colorShader = GLProgramCache.instance.getMust("color");
        this.texShader = GLProgramCache.instance.getMust("texture");
        this.builder0 = new GLMeshBuilder(
            this.gl,
            GLAttribState.POSITION_BIT | GLAttribState.COLOR_BIT,
            this.colorShader,
            null,
            EVertexLayout.INTERLEAVED
        );
        this.builder1 = new GLMeshBuilder(
            this.gl,
            GLAttribState.POSITION_BIT | GLAttribState.COLOR_BIT,
            this.colorShader,
            null,
            EVertexLayout.SEQUENCED
        );
        this.builder2 = new GLMeshBuilder(
            this.gl,
            GLAttribState.POSITION_BIT | GLAttribState.COLOR_BIT,
            this.colorShader,
            null,
            EVertexLayout.SEPARATED
        );

        this.tbuilder0 = new GLMeshBuilder(
            this.gl,
            GLAttribState.POSITION_BIT | GLAttribState.TEXCOORD_BIT,
            this.texShader,
            this.texture,
            EVertexLayout.INTERLEAVED
        );
        this.tbuilder1 = new GLMeshBuilder(
            this.gl,
            GLAttribState.POSITION_BIT | GLAttribState.TEXCOORD_BIT,
            this.texShader,
            this.texture,
            EVertexLayout.SEQUENCED
        );
        this.tbuilder2 = new GLMeshBuilder(
            this.gl,
            GLAttribState.POSITION_BIT | GLAttribState.TEXCOORD_BIT,
            this.texShader,
            this.texture,
            EVertexLayout.SEPARATED
        );

        this.camera.z = 8;

        this.coords = GLCoordSystem.makeViewportCoordSystems(
            canvas.width,
            canvas.height,
            2,
            3
        );
        this.currentDrawMethod = this.drawByMultiViewportsWithTextureShader; //this.drawByMatrixWithColorShader;
        MeshBuilderApplication.setDefaultState(this.gl);
    }

    private setViewport(coord: GLCoordSystem): void {
        this.camera.setViewport(
            coord.viewport[0],
            coord.viewport[1],
            coord.viewport[2],
            coord.viewport[3]
        );
    }

    public drawByMatrixWithColorShader(): void {
        this.camera.setViewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0.8, 0.8, 0.8, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.disable(this.gl.CULL_FACE);

        this.matStack.pushMatrix();
        this.matStack.translate(new vec3([-1.5, 0, 0]));
        this.matStack.rotate(this.angle, vec3.forward);
        mat4.product(
            this.camera.viewProjMatrix,
            this.matStack.worldMatrix,
            mat
        );

        this.builder0.begin(this.gl.TRIANGLES);
        this.builder0.color(1, 0, 0).vertex(-0.5, 0, 0);
        this.builder0.color(0, 1, 0).vertex(0.5, 0, 0);
        this.builder0.color(0, 0, 1).vertex(0, 0.5, 0);
        this.builder0.end(mat);
        this.matStack.popMatrix();

        this.matStack.pushMatrix();
        this.matStack.rotate(this.angle, vec3.up);
        mat4.product(
            this.camera.viewProjMatrix,
            this.matStack.worldMatrix,
            mat
        );

        this.builder1.begin(this.gl.TRIANGLE_FAN);
        this.builder1.color(1, 0, 0).vertex(-0.5, 0, 0);
        this.builder1.color(0, 1, 0).vertex(0.5, 0, 0);
        this.builder1.color(0, 0, 1).vertex(0.5, 0.5, 0);
        this.builder1.color(0, 0, 1).vertex(-0.5, 0.5, 0);
        this.builder1.end(mat);
        this.matStack.popMatrix();

        this.matStack.pushMatrix();
        this.matStack.translate(new vec3([1.5, 0, 0]));
        this.matStack.rotate(-this.angle, new vec3([1, 1, 1]).normalize());
        mat4.product(
            this.camera.viewProjMatrix,
            this.matStack.worldMatrix,
            mat
        );

        DrawHelper.drawWireFrameCubeBox(this.builder2, mat, 0.2);
        this.matStack.popMatrix();

        this.gl.enable(this.gl.CULL_FACE);
    }

    private _cubeTexCoords: number[] = [
        0,
        0.5,
        0.5,
        0.5,
        0.5,
        1,
        0,
        1,
        0.5,
        0.5,
        1,
        0.5,
        1,
        1,
        0.5,
        1,
        0,
        0,
        0.5,
        0,
        0.5,
        0.5,
        0,
        0.5,
        0.5,
        0,
        1,
        0,
        1,
        0.5,
        0.5,
        0.5,
        0.25,
        0.25,
        0.75,
        0.25,
        0.75,
        0.75,
        0.25,
        0.75,
        0,
        0,
        1,
        0,
        1,
        1,
        0,
        1,
    ];

    public drawByMultiViewportsWithTextureShader(): void {
        this.setViewport(this.coords[0]);
        this.gl.clearColor(1, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.matStack.pushMatrix();
        this.matStack.rotate(this.angle, vec3.up);
        mat4.product(
            this.camera.viewProjMatrix,
            this.matStack.worldMatrix,
            mat
        );
        DrawHelper.drawTextureCube(
            this.tbuilder0,
            mat,
            0.5,
            this._cubeTexCoords
        );
        this.matStack.popMatrix();

        this.setViewport(this.coords[1]);

        this.matStack.pushMatrix();
        this.matStack.rotate(this.angle, vec3.right);
        mat4.product(
            this.camera.viewProjMatrix,
            this.matStack.worldMatrix,
            mat
        );
        DrawHelper.drawTextureCube(
            this.tbuilder1,
            mat,
            0.5,
            this._cubeTexCoords
        );
        this.matStack.popMatrix();

        this.setViewport(this.coords[2]);

        this.matStack.pushMatrix();
        this.matStack.rotate(this.angle, vec3.forward);
        mat4.product(
            this.camera.viewProjMatrix,
            this.matStack.worldMatrix,
            mat
        );
        DrawHelper.drawTextureCube(
            this.tbuilder2,
            mat,
            0.5,
            this._cubeTexCoords
        );
        this.matStack.popMatrix();

        this.setViewport(this.coords[3]);

        this.matStack.pushMatrix();
        this.matStack.rotate(this.angle, new vec3([1, 1, 1]).normalize());
        mat4.product(
            this.camera.viewProjMatrix,
            this.matStack.worldMatrix,
            mat
        );
        DrawHelper.drawTextureCube(
            this.tbuilder0,
            mat,
            0.8,
            this._cubeTexCoords
        );
        this.matStack.popMatrix();

        this.setViewport(this.coords[4]);

        this.matStack.pushMatrix();
        this.matStack.rotate(-this.angle, vec3.right);
        mat4.product(
            this.camera.viewProjMatrix,
            this.matStack.worldMatrix,
            mat
        );
        DrawHelper.drawTextureCube(this.tbuilder1, mat, 0.5);
        this.matStack.popMatrix();

        this.setViewport(this.coords[5]);

        this.matStack.pushMatrix();
        this.matStack.rotate(-this.angle, vec3.up);
        mat4.product(
            this.camera.viewProjMatrix,
            this.matStack.worldMatrix,
            mat
        );
        DrawHelper.drawTextureCube(this.tbuilder2, mat, 0.6);
        this.matStack.popMatrix();
    }

    public update(elapsedMsec: number, intervalSec: number): void {
        this.angle += 1;
        super.update(elapsedMsec, intervalSec);
    }

    public render(): void {
        this.currentDrawMethod();
    }

    public onKeyPress(evt: CanvasKeyBoardEvent): void {
        super.onKeyPress(evt);
        if (evt.key === "1") {
            this.currentDrawMethod = this.drawByMatrixWithColorShader;
        } else if (evt.key === "2") {
            this.currentDrawMethod = this.drawByMultiViewportsWithTextureShader;
        }
    }
}
