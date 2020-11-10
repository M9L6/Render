import { Mat2D } from "./Mat2D";
import { Math2D } from "./Math2D";
import { Vec2 } from "./Vec2";

export class MatrixStack {
    private _mats: Mat2D[];
    constructor() {
        this._mats = [];
        this._mats.push(new Mat2D());
    }

    public get matrix(): Mat2D {
        if (this._mats.length === 0) {
            alert("矩阵堆栈为空");
            throw new Error("矩阵堆栈为空");
        }
        return this._mats[this._mats.length - 1];
    }

    public pushMatrix(): void {
        let mat: Mat2D = Mat2D.copy(this.matrix);
        this._mats.push(mat);
    }

    public popMatrix(): void {
        if (this._mats.length === 0) {
            alert("堆栈为空");
            return;
        }
        this._mats.pop();
    }

    public loadIdentity(): void {
        this.matrix.identity();
    }

    public loadMatrix(mat: Mat2D): void {
        Mat2D.copy(mat, this.matrix);
    }

    public multMatrix(mat: Mat2D): void {
        Mat2D.multiply(this.matrix, mat, this.matrix);
    }

    public translate(x: number = 0, y: number = 0): void {
        let mat: Mat2D = Mat2D.makeTranslation(x, y);
        this.multMatrix(mat);
    }

    public rotate(angel: number = 0, isRadian: boolean = true): void {
        if (isRadian === false) {
            angel = Math2D.toRadian(angel);
        }
        let mat: Mat2D = Mat2D.makeRotation(angel);
        this.multMatrix(mat);
    }

    public rotateFrom(v1: Vec2, v2: Vec2, norm: boolean = false): void {
        let mat: Mat2D = Mat2D.makeRotationFromVectors(v1, v2, norm);
        this.multMatrix(mat);
    }

    public scale(x: number = 1.0, y: number = 1.0): void {
        let mat: Mat2D = Mat2D.makeScale(x, y);
        this.multMatrix(mat);
    }

    public invert(): Mat2D {
        let ret: Mat2D = new Mat2D();
        if (Mat2D.invert(this.matrix, ret) === false) {
            alert("堆栈顶部矩阵为奇异矩阵，无法求逆");
            throw new Error("堆栈顶部矩阵为奇异矩阵，无法求逆");
        }
        return ret;
    }
}
