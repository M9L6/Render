import { Math2D } from "../../../math/Math2D";
import { Vec2 } from "../../../math/Vec2";
import { IRenderState } from "../objects/IRenderState";
import { ITransformable } from "../objects/ITransformable";
import { BaseShape2D } from "./BaseShape2D";

export class Rect extends BaseShape2D {
    public width: number;
    public height: number;
    public x: number;
    public y: number;

    constructor(w: number = 1, h: number = 1, u: number = 0, v: number = 0) {
        super();
        this.width = w;
        this.height = h;
        this.x = -this.width * u;
        this.y = -this.height * v;
    }

    public get type(): string {
        return "Rect";
    }

    public hitTest(localPt: Vec2, transform: ITransformable): boolean {
        return Math2D.isPointInRect(
            localPt.x,
            localPt.y,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    public draw(
        transform: ITransformable,
        state: IRenderState,
        context: CanvasRenderingContext2D
    ): void {
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(this.x + this.width, this.y);
        context.lineTo(this.x + this.width, this.y + this.height);
        context.lineTo(this.x, this.y + this.height);
        context.closePath();
        super.draw(transform, state, context);
    }
}
