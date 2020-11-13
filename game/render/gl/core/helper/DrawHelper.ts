import mat4 from "../../../../math/tsm/mat4";
import vec3 from "../../../../math/tsm/vec3";
import vec4 from "../../../../math/tsm/vec4";
import { GLMeshBuilder } from "../GLMeshBuilder";

export class DrawHelper {
    public static drawWireFrameCubeBox(
        builder: GLMeshBuilder,
        mat: mat4,
        halfLen: number = 0.2,
        color: vec4 = new vec4([1, 0, 0, 1])
    ): void {
        let mins: vec3 = new vec3([-halfLen, -halfLen, -halfLen]);
        let maxs: vec3 = new vec3([halfLen, halfLen, halfLen]);
        DrawHelper.drawBoundBox(builder, mat, mins, maxs, color);
    }

    public static drawBoundBox(
        builder: GLMeshBuilder,
        mat: mat4,
        mins: vec3,
        maxs: vec3,
        color: vec4 = new vec4([1, 0, 0, 1])
    ): void {
        builder.begin(builder.gl.LINE_LOOP);
        builder
            .color(color.r, color.g, color.b, color.a)
            .vertex(mins.x, mins.y, mins.z);
        builder
            .color(color.r, color.g, color.b, color.a)
            .vertex(mins.x, mins.y, maxs.z);
        builder
            .color(color.r, color.g, color.b, color.a)
            .vertex(maxs.x, mins.y, maxs.z);
        builder
            .color(color.r, color.g, color.b, color.a)
            .vertex(maxs.x, mins.y, mins.z);
        builder.end(mat);

        builder.begin(builder.gl.LINE_LOOP);
        builder
            .color(color.r, color.g, color.b, color.a)
            .vertex(mins.x, maxs.y, mins.z);
        builder
            .color(color.r, color.g, color.b, color.a)
            .vertex(maxs.x, maxs.y, mins.z);
        builder
            .color(color.r, color.g, color.b, color.a)
            .vertex(maxs.x, maxs.y, maxs.z);
        builder
            .color(color.r, color.g, color.b, color.a)
            .vertex(mins.x, maxs.y, maxs.z);
        builder.end(mat);

        builder.begin(builder.gl.LINES);
        builder
            .color(color.r, color.g, color.b, color.a)
            .vertex(mins.x, mins.y, mins.z);
        builder
            .color(color.r, color.g, color.b, color.a)
            .vertex(mins.x, maxs.y, mins.z);

        builder
            .color(color.r, color.g, color.b, color.a)
            .vertex(mins.x, mins.y, maxs.z);
        builder
            .color(color.r, color.g, color.b, color.a)
            .vertex(mins.x, maxs.y, maxs.z);

        builder
            .color(color.r, color.g, color.b, color.a)
            .vertex(maxs.x, mins.y, maxs.z);
        builder
            .color(color.r, color.g, color.b, color.a)
            .vertex(maxs.x, maxs.y, maxs.z);

        builder
            .color(color.r, color.g, color.b, color.a)
            .vertex(maxs.x, mins.y, mins.z);
        builder
            .color(color.r, color.g, color.b, color.a)
            .vertex(maxs.x, maxs.y, mins.z);
        builder.end(mat);
    }
}
