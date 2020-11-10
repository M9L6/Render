export class Inset {
    public static create(
        l: number = 0,
        t: number = 0,
        r: number = 0,
        b: number = 0
    ): Inset {
        return new Inset(l, t, r, b);
    }

    public values: Float32Array;
    constructor(l: number = 0, t: number = 0, r: number = 0, b: number = 0) {
        this.values = new Float32Array([l, t, r, b]);
    }

    public get leftMargin(): number {
        return this.values[0];
    }
    public set leftMargin(l: number) {
        this.values[0] = l;
    }

    public get topMargin(): number {
        return this.values[1];
    }
    public set topMargin(t: number) {
        this.values[1] = t;
    }

    public get rightMargin(): number {
        return this.values[2];
    }
    public set rightMargin(r: number) {
        this.values[2] = r;
    }

    public get bottomMargin(): number {
        return this.values[3];
    }
    public set bottomMargin(b: number) {
        this.values[3] = b;
    }
}
