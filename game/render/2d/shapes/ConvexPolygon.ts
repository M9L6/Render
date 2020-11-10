import { Math2D } from "../../../math/Math2D";
import { Vec2 } from "../../../math/Vec2";
import { IRenderState } from "../objects/IRenderState";
import { ITransformable } from "../objects/ITransformable";
import { BaseShape2D } from "./BaseShape2D";

export class ConvexPolygon extends BaseShape2D {
    public points: Vec2[];

    constructor(points: Vec2[]) {
        if (points.length < 3) {
            alert("多边形顶点数必须大于等于3");
            throw new Error("多边形顶点数必须大于等于3");
        }
        if (Math2D.isConvex(points) === false) {
            alert("当前多边形不是凸多边形");
            throw new Error("当前多边形不是凸多边形");
        }
        super();
        this.points = points;
    }

    public hitTest(localPt: Vec2, transform: ITransformable): boolean {
        return Math2D.isPointInPolygon(localPt, this.points);
    }

    public draw(
        transform: ITransformable,
        state: IRenderState,
        context: CanvasRenderingContext2D
    ): void {
        context.beginPath();
        context.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            context.lineTo(this.points[i].x, this.points[i].y);
        }
        context.closePath();
        super.draw(transform, state, context);
    }

    public get type(): string {
        return "Polygon";
    }
}
