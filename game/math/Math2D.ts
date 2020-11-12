import { Mat2D } from "./Mat2D";
import { MatrixStack } from "./MatrixStack";
import vec3 from "./tsm/vec3";
import { Vec2 } from "./Vec2";

export class Math2D {
    public static Colors: string[] = [
        "aqua",
        "black",
        "blue",
        "fuchsia",

        "gray",
        "green",
        "lime",
        "maroon",

        "navy",
        "olive",
        "orange",
        "purple",

        "red",
        "silver",
        "teal",
        "white",
        "yellow",
    ];

    public static matStack: MatrixStack = new MatrixStack();

    public static toRadian(degree: number): number {
        return (degree / 180) * Math.PI;
    }

    public static toDegree(radian: number): number {
        return (radian * 180) / Math.PI;
    }

    public static random(min: number, max: number) {
        return min + Math.random() * (max - min);
    }

    public static isEquals(a: number, b: number): boolean {
        return !(Math.abs(a - b) > Number.EPSILON);
    }

    public static projectPointOnLineSegment(
        pt: Vec2,
        start: Vec2,
        end: Vec2,
        closePoint: Vec2
    ): boolean {
        let v0: Vec2 = Vec2.create();
        let v1: Vec2 = Vec2.create();
        let d: number = 0;
        Vec2.difference(pt, start, v0);
        Vec2.difference(end, start, v1);
        d = v1.normalize();
        let t: number = Vec2.dotProduct(v0, v1);
        if (t < 0) {
            closePoint.x = start.x;
            closePoint.y = start.y;
            return false;
        } else if (t > d) {
            closePoint.x = end.x;
            closePoint.y = end.y;
            return false;
        } else {
            Vec2.scaleAdd(start, v1, t, closePoint);
            return true;
        }
    }

    public static isPointInCircle(
        pt: Vec2,
        center: Vec2,
        radius: number
    ): boolean {
        let diff: Vec2 = Vec2.difference(center, pt);
        let len2: number = diff.squaredLength;
        if (len2 <= radius * radius) {
            return true;
        }
        return false;
    }

    public static isPointOnLineSegement(
        pt: Vec2,
        start: Vec2,
        end: Vec2,
        radius: number = 2
    ): boolean {
        let closePt: Vec2 = Vec2.create();
        if (
            Math2D.projectPointOnLineSegment(pt, start, end, closePt) === false
        ) {
            return false;
        }
        return Math2D.isPointInCircle(pt, closePt, radius);
    }

    public static isPointInRect(
        ptX: number,
        ptY: number,
        x: number,
        y: number,
        w: number,
        h: number
    ): boolean {
        if (ptX >= x && ptX <= x + w && ptY >= y && ptY <= y + h) {
            return true;
        }
        return false;
    }

    public static isPointInEllipse(
        ptX: number,
        ptY: number,
        centerX: number,
        centerY: number,
        radiusX: number,
        radiusY: number
    ): boolean {
        let diffX = ptX - centerX;
        let diffY = ptY - centerY;
        let n: number =
            (diffX * diffX) / (radiusX * radiusX) +
            (diffY * diffY) / (radiusY * radiusY);
        return n <= 1.0;
    }

    public static sign(v0: Vec2, v1: Vec2, v2: Vec2): number {
        let e1: Vec2 = Vec2.difference(v0, v2);
        let e2: Vec2 = Vec2.difference(v1, v2);
        return Vec2.crossProduct(e1, e2);
    }

    public static isPointInTriangle(
        pt: Vec2,
        v0: Vec2,
        v1: Vec2,
        v2: Vec2
    ): boolean {
        let b1: boolean = Math2D.sign(v0, v1, pt) < 0.0;
        let b2: boolean = Math2D.sign(v1, v2, pt) < 0.0;
        let b3: boolean = Math2D.sign(v2, v0, pt) < 0.0;
        return b1 === b2 && b2 === b3;
    }

    /**
     * 检测凸多边形
     * @param pt
     * @param points  points[0]为多边形中的一点
     */
    public static isPointInPolygon(pt: Vec2, points: Vec2[]): boolean {
        if (points.length < 3) {
            return false;
        }
        for (let i = 2; i < points.length; i++) {
            if (
                Math2D.isPointInTriangle(
                    pt,
                    points[0],
                    points[i - 1],
                    points[i]
                )
            ) {
                return true;
            }
        }
        return false;
    }

    public static isConvex(points: Vec2[]): boolean {
        let sign: boolean = Math2D.sign(points[0], points[1], points[2]) < 0.0;
        let j: number, k: number;
        for (let i: number = 1; i < points.length; i++) {
            j = (i + 1) % points.length;
            k = (i + 2) % points.length;
            if (sign !== Math2D.sign(points[i], points[j], points[k]) < 0.0) {
                return false;
            }
        }
        return true;
    }

    public static transform(
        mat: Mat2D,
        pt: Vec2,
        result: Vec2 | null = null
    ): Vec2 {
        if (result === null) result = new Vec2();
        result.values[0] =
            mat.values[0] * pt.values[0] +
            mat.values[2] * pt.values[1] +
            mat.values[4];
        result.values[1] =
            mat.values[1] * pt.values[0] +
            mat.values[3] * pt.values[1] +
            mat.values[5];
        return result;
    }

    public static getQuadraticBezierPosition(
        start: number,
        ctrl: number,
        end: number,
        t: number
    ): number {
        if (t < 0.0 || t > 1.0) {
            alert("t的取值范围必须为[0,1]");
            throw new Error("t的取值范围必须为[0,1]");
        }
        let t1: number = 1.0 - t;
        let t2: number = t1 * t1;
        return t2 * start + 2.0 * t * t1 * ctrl + t * t * end;
    }

    public static getQuadraticBezierVector(
        start: Vec2,
        ctrl: Vec2,
        end: Vec2,
        t: number,
        result: Vec2 | null = null
    ): Vec2 {
        if (t < 0.0 || t > 1.0) {
            alert("t的取值范围必须为[0,1]");
            throw new Error("t的取值范围必须为[0,1]");
        }
        if (result === null) result = new Vec2();
        result.x = Math2D.getQuadraticBezierPosition(start.x, ctrl.x, end.x, t);
        result.y = Math2D.getQuadraticBezierPosition(start.y, ctrl.y, end.y, t);
        return result;
    }

    public static getCubicBezierPosition(
        start: number,
        ctrl0: number,
        ctrl1: number,
        end: number,
        t: number
    ): number {
        if (t < 0.0 || t > 1.0) {
            alert("t的取值范围必须为[0,1]");
            throw new Error("t的取值范围必须为[0,1]");
        }
        let t1: number = 1.0 - t;
        let t2: number = t * t;
        let t3: number = t2 * t;
        return (
            t1 * t1 * t1 * start +
            3 * t * t1 * t1 * ctrl0 +
            3 * t2 * t1 * ctrl1 +
            t3 * end
        );
    }

    public static getCubicBezierVector(
        start: Vec2,
        ctrl0: Vec2,
        ctrl1: Vec2,
        end: Vec2,
        t: number,
        result: Vec2 | null = null
    ): Vec2 {
        if (t < 0.0 || t > 1.0) {
            alert("t的取值范围必须为[0,1]");
            throw new Error("t的取值范围必须为[0,1]");
        }
        if (result === null) result = new Vec2();
        result.x = Math2D.getCubicBezierPosition(
            start.x,
            ctrl0.x,
            ctrl1.x,
            end.x,
            t
        );
        result.y = Math2D.getCubicBezierPosition(
            start.y,
            ctrl0.y,
            ctrl1.y,
            end.y,
            t
        );
        return result;
    }

    public static computeNormal(
        a: vec3,
        b: vec3,
        c: vec3,
        normal: vec3 | null
    ): vec3 {
        if (!normal) normal = new vec3();
        let l0: vec3 = new vec3(),
            l1: vec3 = new vec3();
        vec3.difference(b, a, l0);
        vec3.difference(c, a, l1);
        vec3.cross(l0, l1, normal);
        normal.normalize();
        return normal;
    }
}
