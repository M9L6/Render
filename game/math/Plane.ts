import { Math2D } from "./Math2D";
import { epsilon } from "./tsm/constants";
import vec3 from "./tsm/vec3";
import vec4 from "./tsm/vec4";

export enum EPlaneLoc {
    FRONT,
    BACK,
    COPLANAR,
}

export class Plane {
    public static planeFromPoints(
        a: vec3,
        b: vec3,
        c: vec3,
        reuslt: vec4 | null = null
    ): vec4 {
        if (!reuslt) reuslt = new vec4();
        let normal: vec3 = new vec3();
        Math2D.computeNormal(a, b, c, normal);
        let d: number = -vec3.dot(normal, a);
        reuslt.x = normal.x;
        reuslt.y = normal.y;
        reuslt.z = normal.z;
        reuslt.w = d;
        return reuslt;
    }

    public static planeFromPointNormal(
        point: vec3,
        normal: vec3,
        reuslt: vec4 | null = null
    ): vec4 {
        if (!reuslt) reuslt = new vec4();
        let d: number = -vec3.dot(normal, point);
        reuslt.x = normal.x;
        reuslt.y = normal.y;
        reuslt.z = normal.z;
        reuslt.w = d;
        return reuslt;
    }

    public static planeNormalize(plane: vec4): number {
        let length: number, ilength: number;
        length = Math.sqrt(
            plane.x * plane.x + plane.y * plane.y + plane.z * plane.z
        );
        if (length === 0) throw new Error("面积为0的平面");
        ilength = 1.0 / length;
        plane.x *= ilength;
        plane.y *= ilength;
        plane.z *= ilength;
        plane.w *= ilength;
        return length;
    }

    public static planeDistanceFromPoint(plane: vec4, point: vec3): number {
        return (
            point.x * plane.x + point.y * plane.y + point.z * plane.z + plane.w
        );
    }

    public static planeTestPoint(plane: vec4, point: vec3): EPlaneLoc {
        let num: number = Plane.planeDistanceFromPoint(plane, point);
        if (num > epsilon) {
            return EPlaneLoc.FRONT;
        } else if (num < -epsilon) {
            return EPlaneLoc.BACK;
        } else {
            return EPlaneLoc.COPLANAR;
        }
    }
}
