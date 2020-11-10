import { Mat2D } from "./Mat2D";
import { Math2D } from "./Math2D";
import { Vec2 } from "./Vec2";

export class Transform2D {
    public position: Vec2;
    public rotation: number;
    public scale: Vec2;

    constructor(
        x: number = 0,
        y: number = 0,
        rotation: number = 0,
        scaleX: number = 1,
        scaleY: number = 1
    ) {
        this.position = new Vec2(x, y);
        this.rotation = rotation;
        this.scale = new Vec2(scaleX, scaleY);
    }

    public toMatrix(): Mat2D {
        Math2D.matStack.loadIdentity();
        Math2D.matStack.translate(this.position.x, this.position.y);
        Math2D.matStack.rotate(this.rotation, false);
        Math2D.matStack.scale(this.scale.x, this.scale.y);
        return Math2D.matStack.matrix;
    }

    public toInvMatrix(result: Mat2D): boolean {
        let mat: Mat2D = this.toMatrix();
        return Mat2D.invert(mat, result);
    }
}
