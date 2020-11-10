import { Math2D } from "./Math2D";
import { Vec2 } from "./Vec2";

export class Mat2D {
    public static create(
        a: number = 1,
        b: number = 0,
        c: number = 0,
        d: number = 1,
        x: number = 0,
        y: number = 0
    ): Mat2D {
        return new Mat2D(a, b, c, d, x, y);
    }

    public static copy(mat: Mat2D, result: Mat2D | null = null): Mat2D {
        if (result === null) result = new Mat2D();
        result.values[0] = mat.values[0];
        result.values[1] = mat.values[1];
        result.values[2] = mat.values[2];
        result.values[3] = mat.values[3];
        result.values[4] = mat.values[4];
        result.values[5] = mat.values[5];

        return result;
    }

    public static multiply(
        left: Mat2D,
        right: Mat2D,
        result: Mat2D | null = null
    ): Mat2D {
        if (result === null) result = new Mat2D();
        let a0: number = left.values[0],
            a1: number = left.values[1],
            a2: number = left.values[2],
            a3: number = left.values[3],
            a4: number = left.values[4],
            a5: number = left.values[5];
        let b0: number = right.values[0],
            b1 = right.values[1],
            b2 = right.values[2],
            b3 = right.values[3],
            b4 = right.values[4],
            b5 = right.values[5];

        result.values[0] = a0 * b0 + a2 * b1;
        result.values[1] = a1 * b0 + a3 * b1;
        result.values[2] = a0 * b2 + a2 * b3;
        result.values[3] = a1 * b2 + a3 * b3;
        result.values[4] = a0 * b4 + a2 * b5 + a4;
        result.values[5] = a1 * b4 + a3 * b5 + a5;
        return result;
    }

    public static determinant(mat: Mat2D): number {
        return mat.values[0] * mat.values[3] - mat.values[1] * mat.values[2];
    }

    public static invert(src: Mat2D, result: Mat2D): boolean {
        let det: number = Mat2D.determinant(src);
        if (Math2D.isEquals(det, 0)) {
            return false;
        }
        det = 1.0 / det;
        result.values[0] = src.values[3] * det;
        result.values[1] = -src.values[1] * det;
        result.values[2] = -src.values[2] * det;
        result.values[3] = src.values[0] * det;
        result.values[4] =
            (src.values[2] * src.values[5] - src.values[3] * src.values[4]) *
            det;
        result.values[5] =
            (src.values[1] * src.values[4] - src.values[0] * src.values[5]) *
            det;
        return true;
    }

    public static makeTranslation(
        tx: number,
        ty: number,
        result: Mat2D | null = null
    ): Mat2D {
        if (result === null) result = new Mat2D();
        result.values[0] = 1;
        result.values[1] = 0;
        result.values[2] = 0;
        result.values[3] = 1;
        result.values[4] = tx;
        result.values[5] = ty;
        return result;
    }

    public static makeScale(
        sx: number,
        sy: number,
        result: Mat2D | null = null
    ): Mat2D {
        if (result === null) result = new Mat2D();
        result.values[0] = sx;
        result.values[1] = 0;
        result.values[2] = 0;
        result.values[3] = sy;
        result.values[4] = 0;
        result.values[5] = 0;
        return result;
    }

    public static makeRotation(
        radians: number,
        result: Mat2D | null = null
    ): Mat2D {
        if (result === null) result = new Mat2D();
        let s: number = Math.sin(radians),
            c: number = Math.cos(radians);
        result.values[0] = c;
        result.values[1] = s;
        result.values[2] = -s;
        result.values[3] = c;
        result.values[4] = 0;
        result.values[5] = 0;
        return result;
    }

    public static makeRotationFromVectors(
        v1: Vec2,
        v2: Vec2,
        norm: boolean = false,
        result: Mat2D | null = null
    ): Mat2D {
        if (result === null) result = new Mat2D();
        let c: number = Vec2.cosAngle(v1, v2, norm),
            s: number = Vec2.sinAngle(v1, v2, norm);
        result.values[0] = s;
        result.values[1] = c;
        result.values[2] = -s;
        result.values[3] = c;
        result.values[4] = 0;
        result.values[5] = 0;
        return result;
    }

    public values: Float32Array;

    constructor(
        a: number = 1,
        b: number = 0,
        c: number = 0,
        d: number = 1,
        x: number = 0,
        y: number = 0
    ) {
        this.values = new Float32Array([a, b, c, d, x, y]);
    }

    public identity(): void {
        this.values[0] = 1.0;
        this.values[1] = 0.0;
        this.values[2] = 0.0;
        this.values[3] = 1.0;
        this.values[4] = 0.0;
        this.values[5] = 0.0;
    }

    public onlyRotationMatrixInvert(): Mat2D {
        let s: number = this.values[1];
        this.values[1] = this.values[2];
        this.values[2] = s;
        return this;
    }
}
