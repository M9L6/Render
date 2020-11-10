import { Vec2 } from "../../../math/Vec2";
import { IRenderState } from "../objects/IRenderState";
import { ITransformable } from "../objects/ITransformable";
import { BaseShape2D } from "./BaseShape2D";

export class BezierPath extends BaseShape2D {
    public points: Vec2[];
    public isCubic: boolean;

    public get type(): string {
        return "BezierPath";
    }

    constructor(points: Vec2[], isCubic: boolean = false) {
        super();
        this.points = points;
        this.isCubic = isCubic;
        this.data = points;
    }

    public hitTest(localPt: Vec2, transform: ITransformable): boolean {
        return false;
    }

    public draw(
        transform: ITransformable,
        state: IRenderState,
        context: CanvasRenderingContext2D
    ): void {
        context.beginPath();
        context.moveTo(this.points[0].x, this.points[0].y);
        if (this.isCubic) {
            for (let i = 1; i < this.points.length; i += 3) {
                context.bezierCurveTo(
                    this.points[i].x,
                    this.points[i].y,
                    this.points[i + 1].x,
                    this.points[i + 1].y,
                    this.points[i + 2].x,
                    this.points[i + 2].y
                );
            }
        } else {
            for (let i = 1; i < this.points.length; i += 2) {
                context.quadraticCurveTo(
                    this.points[i].x,
                    this.points[i].y,
                    this.points[i + 1].x,
                    this.points[i + 1].y
                );
            }
        }
        super.draw(transform, state, context);
    }
}
