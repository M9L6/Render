import { Size } from "./Size";
import { Vec2 } from "./Vec2";

export class Rectangle {
    public static create(
        x: number = 0,
        y: number = 0,
        w: number = 1,
        h: number = 1
    ): Rectangle {
        let origin = new Vec2(x, y);
        let size = new Size(w, h);
        return new Rectangle(origin, size);
    }

    public origin: Vec2;
    public size: Size;

    constructor(origin: Vec2 = new Vec2(), size: Size = new Size(1, 1)) {
        this.origin = origin;
        this.size = size;
    }
}
