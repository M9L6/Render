import { Math2D } from "../../../math/Math2D";
import { Vec2 } from "../../../math/Vec2";
import { IRenderState } from "../objects/IRenderState";
import { ITransformable } from "../objects/ITransformable";
import { BaseShape2D } from "./BaseShape2D";

export class Ellipse extends BaseShape2D {
    public radiusX: number;
    public radiusY: number;
    constructor(radiusX: number = 10, radiusY: number = 10) {
        super();
        this.radiusX = radiusX;
        this.radiusY = radiusY;
    }

    public hitTest(localPt: Vec2, transform: ITransformable): boolean {
        return Math2D.isPointInEllipse(
            localPt.x,
            localPt.y,
            0,
            0,
            this.radiusX,
            this.radiusY
        );
    }

    public draw(
        transform: ITransformable,
        state: IRenderState,
        context: CanvasRenderingContext2D
    ): void {
        context.beginPath();
        context.ellipse(
            0,
            0,
            this.radiusX,
            this.radiusY,
            0,
            0,
            Math.PI * 2,
            true
        );
        super.draw(transform, state, context);
    }

    public get type(): string {
        return "Ellipse";
    }
}
