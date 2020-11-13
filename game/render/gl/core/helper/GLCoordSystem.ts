import vec3 from "../../../../math/tsm/vec3";

export class GLCoordSystem {
    public static makeViewportCoordSystems(
        width: number,
        height: number,
        row: number = 2,
        col: number = 2
    ): GLCoordSystem[] {
        let coords: GLCoordSystem[] = [];
        let w: number = width / row,
            h: number = height / col;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                coords.push(new GLCoordSystem([i * w, +j * h, w, h]));
            }
        }
        return coords;
    }

    public viewport: number[] = [];
    public axis: vec3;
    public angle: number;
    public pos: vec3;
    public isDrawAxis: boolean;
    public isD3D: boolean;
    constructor(
        viewport: number[],
        pos: vec3 = vec3.zero,
        axis: vec3 = vec3.up,
        angle: number = 0,
        isDrawAxis: boolean = false,
        isD3D: boolean = false
    ) {
        this.viewport = viewport;
        this.angle = angle;
        this.axis = axis;
        this.pos = pos;
        this.isDrawAxis = isDrawAxis;
        this.isD3D = isD3D;
    }
}
