import { Math2D } from "../../../math/Math2D";
import mat4 from "../../../math/tsm/mat4";
import vec3 from "../../../math/tsm/vec3";

const mat: mat4 = new mat4();

export enum ECameraType {
    FPSCAREMA,
    FLYCAMERA,
}

export class Camera {
    public gl: WebGLRenderingContext;
    private _type: ECameraType = ECameraType.FLYCAMERA;
    private _position: vec3 = new vec3();
    private _xAxis: vec3 = new vec3([1, 0, 0]);
    private _yAxis: vec3 = new vec3([0, 1, 0]);
    private _zAxis: vec3 = new vec3([0, 0, 1]);
    private _viewMatrix: mat4;
    private _near: number;
    private _far: number;
    private _fovY: number;
    private _aspectRatio: number;
    private _projectionMatirx: mat4;
    private _viewProjnMatrix: mat4;
    private _invViewProjMatrix: mat4;

    public get fovY(): number {
        return this._fovY;
    }
    public set fovY(v: number) {
        this._fovY = v;
    }

    public get near(): number {
        return this._near;
    }
    public set near(v: number) {
        this._near = v;
    }

    public get far(): number {
        return this._far;
    }
    public set far(v: number) {
        this._far = v;
    }

    public get aspect(): number {
        return this._aspectRatio;
    }
    public set aspect(v: number) {
        this._aspectRatio = v;
    }

    public get position(): vec3 {
        return this._position;
    }
    public set position(v: vec3) {
        this._position = v;
    }

    public get x(): number {
        return this._position.x;
    }
    public set x(v: number) {
        this._position.x = v;
    }

    public get y(): number {
        return this._position.y;
    }
    public set y(v: number) {
        this._position.y = v;
    }

    public get z(): number {
        return this._position.z;
    }
    public set z(v: number) {
        this._position.z = v;
    }

    public get xAxis(): vec3 {
        return this._xAxis;
    }
    public get yAxis(): vec3 {
        return this._yAxis;
    }
    public get zAxis(): vec3 {
        return this._zAxis;
    }

    public get type(): ECameraType {
        return this._type;
    }
    public set type(v: ECameraType) {
        this._type = v;
    }

    constructor(
        gl: WebGLRenderingContext,
        width: number,
        height: number,
        fovY: number = 45,
        zNear: number = 1,
        zFar: number = 1000
    ) {
        this.gl = gl;
        this._aspectRatio = width / height;
        this._fovY = fovY;
        this._near = zNear;
        this._far = zFar;
        this._projectionMatirx = new mat4();
        this._viewMatrix = new mat4();
        this._viewProjnMatrix = new mat4();
        this._invViewProjMatrix = new mat4();
    }

    public moveForward(speed: number): void {
        if (this._type === ECameraType.FPSCAREMA) {
            this._position.x += this._zAxis.x * speed;
            this._position.y += this._zAxis.z * speed;
        } else {
            this._position.x += this._zAxis.x * speed;
            this._position.y += this._zAxis.y * speed;
            this._position.z += this._zAxis.z * speed;
        }
    }

    public moveRightward(speed: number): void {
        if (this._type === ECameraType.FPSCAREMA) {
            this._position.x += this._xAxis.x * speed;
            this._position.y += this._xAxis.z * speed;
        } else {
            this._position.x += this._xAxis.x * speed;
            this._position.y += this._xAxis.y * speed;
            this._position.z += this._xAxis.z * speed;
        }
    }

    public moveUpward(speed: number): void {
        if (this._type === ECameraType.FPSCAREMA) {
            this._position.y += speed;
        } else {
            this._position.x += this._yAxis.x * speed;
            this._position.y += this._yAxis.y * speed;
            this._position.z += this._yAxis.z * speed;
        }
    }

    public yaw(angle: number): void {
        mat.setIdentity();
        angle = Math2D.toRadian(angle);

        if (this._type === ECameraType.FPSCAREMA) {
            mat.rotate(angle, vec3.up);
        } else {
            mat.rotate(angle, this._yAxis);
        }
        mat.multiplyVec3(this._zAxis, this._zAxis);
        mat.multiplyVec3(this._xAxis, this._xAxis);
    }

    public pitch(angle: number): void {
        mat.setIdentity();
        angle = Math2D.toRadian(angle);
        mat.rotate(angle, this._xAxis);

        mat.multiplyVec3(this._zAxis, this._zAxis);
        mat.multiplyVec3(this._yAxis, this._yAxis);
    }

    public roll(angle: number): void {
        if (this._type === ECameraType.FLYCAMERA) {
            angle = Math2D.toRadian(angle);
            mat.setIdentity();
            mat.rotate(angle, this._zAxis);
            mat.multiplyVec3(this._xAxis, this._xAxis);
            mat.multiplyVec3(this._yAxis, this._yAxis);
        }
    }

    public update(intervalSec: number): void {
        this._projectionMatirx = mat4.perspective(
            this._fovY,
            this._aspectRatio,
            this._near,
            this._far
        );
        this._calcViewMatrix();
        mat4.product(
            this._projectionMatirx,
            this._viewMatrix,
            this._viewProjnMatrix
        );
        this._viewProjnMatrix.copy(this._invViewProjMatrix);
        this._invViewProjMatrix.inverse();
    }

    private _calcViewMatrix(): void {
        this._zAxis.normalize();
        vec3.cross(this._zAxis, this._xAxis, this._yAxis);
        this._yAxis.normalize();
        vec3.cross(this._yAxis, this._zAxis, this._xAxis);
        this._xAxis.normalize();
        let x: number = -vec3.dot(this._xAxis, this._position),
            y: number = -vec3.dot(this._yAxis, this._position),
            z: number = -vec3.dot(this._zAxis, this._position);

        this._viewMatrix.Values[0] = this._xAxis.x;
        this._viewMatrix.Values[1] = this._yAxis.x;
        this._viewMatrix.Values[2] = this._zAxis.x;
        this._viewMatrix.Values[3] = 0.0;

        this._viewMatrix.Values[4] = this._xAxis.y;
        this._viewMatrix.Values[5] = this._yAxis.y;
        this._viewMatrix.Values[6] = this._zAxis.y;
        this._viewMatrix.Values[7] = 0.0;

        this._viewMatrix.Values[8] = this._xAxis.z;
        this._viewMatrix.Values[9] = this._yAxis.z;
        this._viewMatrix.Values[10] = this._zAxis.z;
        this._viewMatrix.Values[11] = 0.0;

        this._viewMatrix.Values[12] = x;
        this._viewMatrix.Values[13] = y;
        this._viewMatrix.Values[14] = z;
        this._viewMatrix.Values[15] = 1.0;
    }

    public lookAt(target: vec3, up: vec3 = vec3.up): void {
        this._viewMatrix = mat4.lookAt(this._position, target, up);

        this._xAxis.x = this._viewMatrix.Values[0];
        this._yAxis.x = this._viewMatrix.Values[1];
        this._zAxis.x = this._viewMatrix.Values[2];

        this._xAxis.y = this._viewMatrix.Values[4];
        this._yAxis.y = this._viewMatrix.Values[5];
        this._zAxis.y = this._viewMatrix.Values[6];

        this._xAxis.z = this._viewMatrix.Values[8];
        this._yAxis.z = this._viewMatrix.Values[9];
        this._zAxis.z = this._viewMatrix.Values[10];
    }

    public setViewport(
        x: number,
        y: number,
        width: number,
        height: number
    ): void {
        this.gl.viewport(x, y, width, height);
    }

    public getViewport(): Int32Array {
        return this.gl.getParameter(this.gl.VIEWPORT);
    }
}
