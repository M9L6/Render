import { Math2D } from "../../../math/Math2D";
import { Vec2 } from "../../../math/Vec2";
import { IRenderState } from "../objects/IRenderState";
import { ITransformable } from "../objects/ITransformable";
import { BaseShape2D } from "./BaseShape2D";

export class Circle extends BaseShape2D {
    public radius: number;
    constructor(radius: number) {
        super();
        this.radius = radius;
    }

    public hitTest(localPt: Vec2, transform: ITransformable): boolean {
        return Math2D.isPointInCircle(localPt, Vec2.create(0, 0), this.radius);
    }

    public draw(
        transform: ITransformable,
        state: IRenderState,
        context: CanvasRenderingContext2D
    ): void {
        context.beginPath();
        context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        super.draw(transform, state, context);
    }

    public get type(): string {
        return "Circle";
    }
}
