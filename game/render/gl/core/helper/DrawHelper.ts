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

    public static drawTextureCube(
        builder: GLMeshBuilder,
        mat: mat4,
        halfLen: number = 0.2,
        tc: number[] = [
            0,
            0,
            1,
            0,
            1,
            1,
            0,
            1,
            0,
            0,
            1,
            0,
            1,
            1,
            0,
            1,
            0,
            0,
            1,
            0,
            1,
            1,
            0,
            1,
            0,
            0,
            1,
            0,
            1,
            1,
            0,
            1,
            0,
            0,
            1,
            0,
            1,
            1,
            0,
            1,
            0,
            0,
            1,
            0,
            1,
            1,
            0,
            1,
        ]
    ): void {
        builder.begin(builder.gl.TRIANGLE_FAN);

        builder.texcoord(tc[0], tc[1]).vertex(-halfLen, -halfLen, halfLen);
        builder.texcoord(tc[2], tc[3]).vertex(halfLen, -halfLen, halfLen);
        builder.texcoord(tc[4], tc[5]).vertex(halfLen, halfLen, halfLen);
        builder.texcoord(tc[6], tc[7]).vertex(-halfLen, halfLen, halfLen);
        builder.end(mat);

        builder.begin(builder.gl.TRIANGLE_FAN);
        builder.texcoord(tc[8], tc[9]).vertex(halfLen, -halfLen, halfLen);
        builder.texcoord(tc[10], tc[11]).vertex(halfLen, -halfLen, -halfLen);
        builder.texcoord(tc[12], tc[13]).vertex(halfLen, halfLen, -halfLen);
        builder.texcoord(tc[14], tc[15]).vertex(halfLen, halfLen, halfLen);
        builder.end(mat);

        builder.begin(builder.gl.TRIANGLE_FAN);
        builder.texcoord(tc[16], tc[17]).vertex(halfLen, -halfLen, -halfLen);
        builder.texcoord(tc[18], tc[19]).vertex(-halfLen, -halfLen, -halfLen);
        builder.texcoord(tc[20], tc[21]).vertex(-halfLen, halfLen, -halfLen);
        builder.texcoord(tc[22], tc[23]).vertex(halfLen, halfLen, -halfLen);
        builder.end(mat);

        builder.begin(builder.gl.TRIANGLE_FAN);
        builder.texcoord(tc[24], tc[25]).vertex(-halfLen, -halfLen, -halfLen);
        builder.texcoord(tc[26], tc[27]).vertex(-halfLen, -halfLen, halfLen);
        builder.texcoord(tc[28], tc[29]).vertex(-halfLen, halfLen, halfLen);
        builder.texcoord(tc[30], tc[31]).vertex(-halfLen, halfLen, -halfLen);
        builder.end(mat);

        builder.begin(builder.gl.TRIANGLE_FAN);
        builder.texcoord(tc[32], tc[33]).vertex(-halfLen, halfLen, halfLen);
        builder.texcoord(tc[34], tc[35]).vertex(halfLen, halfLen, halfLen);
        builder.texcoord(tc[36], tc[37]).vertex(halfLen, halfLen, -halfLen);
        builder.texcoord(tc[38], tc[39]).vertex(-halfLen, halfLen, -halfLen);
        builder.end(mat);

        builder.begin(builder.gl.TRIANGLE_FAN);
        builder.texcoord(tc[40], tc[41]).vertex(-halfLen, -halfLen, halfLen);
        builder.texcoord(tc[42], tc[43]).vertex(-halfLen, -halfLen, -halfLen);
        builder.texcoord(tc[44], tc[45]).vertex(halfLen, -halfLen, -halfLen);
        builder.texcoord(tc[46], tc[47]).vertex(halfLen, -halfLen, halfLen);
        builder.end(mat);
    }
}
