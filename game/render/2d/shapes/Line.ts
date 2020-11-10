import { Mat2D } from "../../../math/Mat2D";
import { Math2D } from "../../../math/Math2D";
import { Vec2 } from "../../../math/Vec2";
import { IRenderState } from "../objects/IRenderState";
import { ITransformable } from "../objects/ITransformable";
import { IShape } from "./IShape";

export class Line implements IShape {
    public start: Vec2;
    public end: Vec2;
    public data: any;

    constructor(len: number = 10, t: number = 0) {
        if (t < 0 || t > 1.0) {
            alert("t必须设置为[0,1]");
            throw new Error("t必须设置为[0,1]");
        }
        this.start = Vec2.create(-len * t, 0);
        this.end = Vec2.create(len * (1 - t), 0);
        this.data = undefined;
    }

    public hitTest(localPt: Vec2, transform: ITransformable): boolean {
        return Math2D.isPointOnLineSegement(localPt, this.start, this.end);
    }

    public beginDraw(
        transform: ITransformable,
        state: IRenderState,
        context: CanvasRenderingContext2D
    ): void {
        context.save();

        context.lineWidth = state.lineWidth;
        context.strokeStyle = state.strokeStyle;

        let mat: Mat2D = transform.getWorldMatrix();
        context.setTransform(
            mat.values[0],
            mat.values[1],
            mat.values[2],
            mat.values[3],
            mat.values[4],
            mat.values[5]
        );
    }

    public draw(
        transform: ITransformable,
        state: IRenderState,
        context: CanvasRenderingContext2D
    ): void {
        context.beginPath();
        context.moveTo(this.start.x, this.start.y);
        context.lineTo(this.end.x, this.end.y);
        context.stroke();
    }

    public endDraw(
        transform: ITransformable,
        state: IRenderState,
        context: CanvasRenderingContext2D
    ): void {
        context.restore();
    }

    public get type(): string {
        return "Line";
    }
}
