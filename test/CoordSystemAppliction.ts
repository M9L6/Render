import { CamerApplication } from "../game/CameraApplication";
import { CanvasKeyBoardEvent } from "../game/input/CanvasKeyBoardEvent";
import { Math2D } from "../game/math/Math2D";
import mat4 from "../game/math/tsm/mat4";
import vec3 from "../game/math/tsm/vec3";
import vec4 from "../game/math/tsm/vec4";
import { GLAttribState } from "../game/render/gl/core/GLAttribState";
import {
    EVertexLayout,
    GLMeshBuilder,
} from "../game/render/gl/core/GLMeshBuilder";
import { GLProgramCache } from "../game/render/gl/core/GLProgramCache";
import { DrawHelper } from "../game/render/gl/core/helper/DrawHelper";
import {
    EAxisType,
    GLCoordSystem,
} from "../game/render/gl/core/helper/GLCoordSystem";

export class CoordSystemApplication extends CamerApplication {
    public coordSystems: GLCoordSystem[] = [];
    public mvp: mat4 = new mat4();
    public cubeMvp: mat4 = new mat4();
    public currentDrawMethod: (s: GLCoordSystem) => void;
    public isOneViewport: boolean = false;

    public builder: GLMeshBuilder;

    public speed: number = 100;
    public isD3DMode: boolean = false;
    public isDrawAxis: boolean = false;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, { preserveDrawingBuffer: false }, true);
        this.makeFourtGLCoordSystems();
        this.currentDrawMethod = this.drawCoordSystem;

        this.builder = new GLMeshBuilder(
            this.gl,
            GLAttribState.POSITION_BIT | GLAttribState.COLOR_BIT,
            GLProgramCache.instance.getMust("color"),
            null,
            EVertexLayout.INTERLEAVED
        );
    }

    public makeFourtGLCoordSystems(): void {
        this.coordSystems = [];
        let hw: number = this.canvas.width * 0.5,
            hh: number = this.canvas.height * 0.5;
        let dir: vec3 = new vec3([1, 1, 1]).normalize();
        this.coordSystems.push(
            new GLCoordSystem([0, hh, hw, hh], vec3.zero, vec3.up, 0)
        );
        this.coordSystems.push(
            new GLCoordSystem([hw, hh, hw, hh], vec3.zero, vec3.right, 0)
        );
        this.coordSystems.push(
            new GLCoordSystem([0, 0, hw, hh], vec3.zero, vec3.forward, 0)
        );
        this.coordSystems.push(
            new GLCoordSystem([hw, 0, hw, hh], vec3.zero, dir, 0, true)
        );
        this.isD3DMode = false;
    }

    public makeOneGLCoordSystem(): void {
        this.coordSystems = [];
        this.coordSystems.push(
            new GLCoordSystem(
                [0, 0, this.canvas.width, this.canvas.height],
                vec3.zero,
                new vec3([1, 1, 0]).normalize(),
                45,
                true
            )
        );
    }

    public drawCoordSystem(s: GLCoordSystem): void {
        this.camera.setViewport(
            s.viewport[0],
            s.viewport[1],
            s.viewport[2],
            s.viewport[3]
        );

        this.matStack.pushMatrix();
        this.matStack.translate(s.pos);
        this.matStack.rotate(s.angle, s.axis, false);
        mat4.product(
            this.camera.viewProjMatrix,
            this.matStack.worldMatrix,
            this.mvp
        );
        DrawHelper.drawFullCoordSystem(
            this.builder,
            this.mvp,
            1,
            this.isDrawAxis ? s.axis : null
        );
        this.matStack.popMatrix();
    }

    public drawFullCoordSystemWithRotatedCube(s: GLCoordSystem): void {
        this.camera.setViewport(
            s.viewport[0],
            s.viewport[1],
            s.viewport[2],
            s.viewport[3]
        );

        this.matStack.pushMatrix();
        this.matStack.translate(s.pos);
        this.matStack.rotate(s.angle, s.axis, false);
        mat4.product(
            this.camera.viewProjMatrix,
            this.matStack.worldMatrix,
            this.mvp
        );
        DrawHelper.drawFullCoordSystem(
            this.builder,
            this.mvp,
            1,
            this.isDrawAxis ? s.axis : null
        );
        this.matStack.popMatrix();

        //x
        this.matStack.pushMatrix();
        this.matStack.rotate(s.angle, vec3.right, false);
        this.matStack.translate(new vec3([0.8, 0.4, 0]));
        this.matStack.rotate(s.angle * 2, vec3.right, false);
        mat4.product(
            this.camera.viewProjMatrix,
            this.matStack.worldMatrix,
            this.cubeMvp
        );
        DrawHelper.drawWireFrameCubeBox(this.builder, this.cubeMvp, 0.1);
        this.matStack.popMatrix();

        //y
        this.matStack.pushMatrix();
        this.matStack.rotate(s.angle, vec3.up, false);
        this.matStack.translate(new vec3([0.2, 0.8, 0]));
        this.matStack.rotate(s.angle * 2, vec3.up, false);
        mat4.product(
            this.camera.viewProjMatrix,
            this.matStack.worldMatrix,
            this.cubeMvp
        );
        DrawHelper.drawWireFrameCubeBox(
            this.builder,
            this.cubeMvp,
            0.1,
            new vec4([0, 1, 0, 1])
        );
        this.matStack.popMatrix();

        //z
        this.matStack.pushMatrix();
        this.matStack.translate(new vec3([0.0, 0.0, 0.8]));
        this.matStack.rotate(s.angle * 2, vec3.forward, false);
        mat4.product(
            this.camera.viewProjMatrix,
            this.matStack.worldMatrix,
            this.cubeMvp
        );
        DrawHelper.drawWireFrameCubeBox(
            this.builder,
            this.cubeMvp,
            0.1,
            new vec4([0, 0, 1, 1])
        );
        this.matStack.popMatrix();

        this.matStack.pushMatrix();
        this.matStack.translate(s.axis.scale(0.8, new vec3()));
        this.matStack.translate(new vec3([0, 0.3, 0]));
        this.matStack.rotate(s.angle, s.axis, false);
        mat4.product(
            this.camera.viewProjMatrix,
            this.matStack.worldMatrix,
            this.cubeMvp
        );
        DrawHelper.drawWireFrameCubeBox(
            this.builder,
            this.cubeMvp,
            0.1,
            new vec4()
        );
        this.matStack.popMatrix();

        this.drawText(vec3.right, EAxisType.XAXIS, this.mvp, false);
        this.drawText(new vec3([-1, 0, 0]), EAxisType.XAXIS, this.mvp, true);

        this.drawText(vec3.up, EAxisType.YAXIS, this.mvp, false);
        this.drawText(new vec3([0, -1, 0]), EAxisType.YAXIS, this.mvp, true);
        if (this.isD3DMode === false) {
            this.drawText(vec3.forward, EAxisType.ZAXIS, this.mvp, false);
            this.drawText(
                new vec3([0, 0, -1]),
                EAxisType.ZAXIS,
                this.mvp,
                true
            );
        }
    }

    public drawFullCoordSystem(s: GLCoordSystem): void {
        this.camera.setViewport(
            s.viewport[0],
            s.viewport[1],
            s.viewport[2],
            s.viewport[3]
        );

        this.matStack.pushMatrix();
        this.matStack.translate(s.pos);
        this.matStack.rotate(s.angle, s.axis, false);
        mat4.product(
            this.camera.viewProjMatrix,
            this.matStack.worldMatrix,
            this.mvp
        );
        DrawHelper.drawFullCoordSystem(
            this.builder,
            this.mvp,
            1,
            this.isDrawAxis ? s.axis : null
        );
        this.matStack.popMatrix();

        this.drawText(vec3.right, EAxisType.XAXIS, this.mvp, false);
        this.drawText(new vec3([-1, 0, 0]), EAxisType.XAXIS, this.mvp, true);

        this.drawText(vec3.up, EAxisType.YAXIS, this.mvp, false);
        this.drawText(new vec3([0, -1, 0]), EAxisType.YAXIS, this.mvp, true);
        if (this.isD3DMode === false) {
            this.drawText(vec3.forward, EAxisType.ZAXIS, this.mvp, false);
            this.drawText(
                new vec3([0, 0, -1]),
                EAxisType.ZAXIS,
                this.mvp,
                true
            );
        }
    }

    public drawText(
        pos: vec3,
        type: EAxisType,
        mat: mat4,
        isNegative: boolean
    ): void {
        if (this.ctx2D === null) {
            return;
        }

        let out: vec3 = new vec3();
        if (Math2D.obj2ScreenSpace(pos, mat, this.camera.getViewport(), out)) {
            out.y = this.canvas.width - out.y;
            this.ctx2D.save();
            this.ctx2D.font = "30px Arial";
            if (type === EAxisType.XAXIS) {
                this.ctx2D.textBaseline = "top";
                this.ctx2D.fillStyle = "red";
                if (isNegative) {
                    this.ctx2D.textAlign = "right";
                    this.ctx2D.fillText("-X", out.x, out.y);
                } else {
                    this.ctx2D.textAlign = "left";
                    this.ctx2D.fillText("X", out.x, out.y);
                }
            } else if (type === EAxisType.YAXIS) {
                this.ctx2D.textAlign = "center";
                this.ctx2D.fillStyle = "green";
                if (isNegative) {
                    this.ctx2D.textBaseline = "top";
                    this.ctx2D.fillText("-Y", out.x, out.y);
                } else {
                    this.ctx2D.textBaseline = "bottom";
                    this.ctx2D.fillText("Y", out.x, out.y);
                }
            } else {
                this.ctx2D.fillStyle = "blue";
                if (isNegative) {
                    this.ctx2D.textAlign = "right";
                    this.ctx2D.fillText("-Z", out.x, out.y);
                } else {
                    this.ctx2D.textAlign = "left";
                    this.ctx2D.fillText("Z", out.x, out.y);
                }
            }
            this.ctx2D.restore();
        }
    }

    public update(elapsedMsec: number, intervalSec: number): void {
        for (let i = 0; i < this.coordSystems.length; i++) {
            let s: GLCoordSystem = this.coordSystems[i];
            s.angle += this.speed * intervalSec;
        }

        super.update(elapsedMsec, intervalSec);
    }

    public render(): void {
        if (this.ctx2D === null) {
            return;
        }
        this.ctx2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i: number = 0; i < this.coordSystems.length; i++) {
            let s: GLCoordSystem = this.coordSystems[i];
            this.currentDrawMethod(s);
        }
    }

    public onKeyPress(evt: CanvasKeyBoardEvent): void {
        super.onKeyPress(evt);

        if (evt.key === "1") {
            this.currentDrawMethod = this.drawCoordSystem;
        } else if (evt.key === "2") {
            this.currentDrawMethod = this.drawFullCoordSystem;
        } else if (evt.key === "3") {
            this.currentDrawMethod = this.drawFullCoordSystemWithRotatedCube;
        } else if (evt.key === "c") {
            this.isOneViewport = !this.isOneViewport;
            if (this.isOneViewport) {
                this.makeOneGLCoordSystem();
            } else {
                this.makeFourtGLCoordSystems();
            }
        }
    }
}
