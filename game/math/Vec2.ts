import { Math2D } from "./Math2D";

export class Vec2 {
    public static xAxis: Vec2 = new Vec2(1, 0);
    public static nXAxis: Vec2 = new Vec2(-1, 0);
    public static yAxis: Vec2 = new Vec2(0, 1);
    public static nYAxis: Vec2 = new Vec2(0, -1);

    public static create(x: number = 0, y: number = 0): Vec2 {
        return new Vec2(x, y);
    }

    public static copy(src: Vec2, result: Vec2 | null = null): Vec2 {
        if (result === null) result = Vec2.create();
        result.values[0] = src.values[0];
        result.values[1] = src.values[1];
        return result;
    }

    public static sum(
        left: Vec2,
        right: Vec2,
        result: Vec2 | null = null
    ): Vec2 {
        if (result === null) result = new Vec2();
        result.values[0] = left.values[0] + right.values[0];
        result.values[1] = left.values[1] + right.values[1];
        return result;
    }

    public static difference(
        end: Vec2,
        start: Vec2,
        result: Vec2 | null = null
    ): Vec2 {
        if (result === null) result = new Vec2();
        result.values[0] = end.values[0] - start.values[0];
        result.values[1] = end.values[1] - start.values[1];
        return result;
    }

    public static scale(
        direction: Vec2,
        scalar: number,
        result: Vec2 | null = null
    ): Vec2 {
        if (result === null) result = new Vec2();
        result.values[0] = direction.values[0] * scalar;
        result.values[1] = direction.values[1] * scalar;
        return result;
    }

    public static scaleAdd(
        start: Vec2,
        direction: Vec2,
        scalar: number,
        result: Vec2 | null = null
    ): Vec2 {
        if (result === null) result = new Vec2();
        result.values[0] = start.values[0] + direction.values[0] * scalar;
        result.values[1] = start.values[0] + direction.values[1] * scalar;
        return result;
    }

    public static dotProduct(left: Vec2, right: Vec2): number {
        return (
            left.values[0] * right.values[0] + left.values[1] * right.values[1]
        );
    }

    public static crossProduct(left: Vec2, right: Vec2): number {
        return (
            left.values[0] * right.values[1] - left.values[1] * right.values[0]
        );
    }

    public static getAngle(
        a: Vec2,
        b: Vec2,
        isRadian: boolean = false
    ): number {
        let dot: number = Vec2.dotProduct(a, b);
        let radian: number = Math.acos(dot / (a.length * b.length));
        if (isRadian === false) {
            radian = Math2D.toDegree(radian);
        }
        return radian;
    }

    public static getOrientation(
        from: Vec2,
        to: Vec2,
        isRadian: boolean = false
    ): number {
        let diff: Vec2 = Vec2.difference(to, from);
        let radian = Math.atan2(diff.y, diff.x);
        if (isRadian === false) {
            radian = Math2D.toDegree(radian);
        }
        return radian;
    }

    public static sinAngle(a: Vec2, b: Vec2, norm: boolean = false): number {
        if (norm === true) {
            a.normalize();
            b.normalize();
        }
        return a.x * b.y - b.x * a.y;
    }

    public static cosAngle(a: Vec2, b: Vec2, norm: boolean = false): number {
        if (norm === true) {
            a.normalize();
            b.normalize();
        }
        return Vec2.dotProduct(a, b);
    }

    public values: Float32Array;

    public get x(): number {
        return this.values[0];
    }
    public set x(v: number) {
        this.values[0] = v;
    }
    public get y(): number {
        return this.values[1];
    }
    public set y(v: number) {
        this.values[1] = v;
    }

    constructor(x: number = 0, y: number = 0) {
        this.values = new Float32Array([x, y]);
    }

    public toString(): string {
        return "(" + this.values[0] + "," + this.values[1] + ")";
    }

    public reset(x: number = 0, y: number = 0): Vec2 {
        this.values[0] = x;
        this.values[1] = y;
        return this;
    }

    public equals(vec: Vec2): boolean {
        if (Math.abs(this.values[0] - vec.values[0]) > Number.EPSILON) {
            return false;
        }
        if (Math.abs(this.values[1] - vec.values[1]) > Number.EPSILON) {
            return false;
        }
        return true;
    }

    public get squaredLength(): number {
        let x = this.values[0],
            y = this.values[1];
        return x * x + y * y;
    }

    public get length(): number {
        return Math.sqrt(this.squaredLength);
    }

    public normalize(): number {
        let len: number = this.length;
        if (Math2D.isEquals(len, 0)) {
            this.values[0] = 0;
            this.values[1] = 0;
            return 0;
        }
        if (Math2D.isEquals(len, 1)) {
            return 1;
        }
        this.values[0] /= len;
        this.values[1] / len;
        return len;
    }

    public add(right: Vec2): Vec2 {
        return Vec2.sum(this, right, this);
    }

    public substract(another: Vec2): Vec2 {
        return Vec2.difference(this, another, this);
    }

    public negative(): Vec2 {
        this.values[0] = -this.values[0];
        this.values[1] = -this.values[1];
        return this;
    }

    public innerProdcut(right: Vec2): number {
        return Vec2.dotProduct(this, right);
    }
}
