export class Size {
    public static create(w: number = 1, h: number = 1): Size {
        return new Size(w, h);
    }

    public values: Float32Array;

    public get width(): number {
        return this.values[0];
    }
    public set width(v: number) {
        this.values[0] = v;
    }
    public get height(): number {
        return this.values[1];
    }
    public set height(v: number) {
        this.values[1] = v;
    }

    constructor(w: number = 1, h: number = 1) {
        this.values = new Float32Array([w, h]);
    }
}
