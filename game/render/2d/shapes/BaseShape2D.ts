import { Mat2D } from "../../../math/Mat2D";
import { Vec2 } from "../../../math/Vec2";
import { ERenderType, IRenderState } from "../objects/IRenderState";
import { ITransformable } from "../objects/ITransformable";
import { IShape } from "./IShape";

export abstract class BaseShape2D implements IShape {
    public abstract get type(): string;
    public abstract hitTest(localPt: Vec2, transform: ITransformable): boolean;
    public axisXStyle: string | CanvasGradient | CanvasPattern;
    public axisYStyle: string | CanvasGradient | CanvasPattern;
    public axisLineLength: number;
    public axisLength: number;
    public data: any;
    constructor() {
        this.axisXStyle = "rgba(255,0,0,128)";
        this.axisYStyle = "rgba(0,255,0,128)";
        this.axisLineLength = 1;
        this.axisLength = 100;
        this.data = undefined;
    }

    protected drawLine(
        ctx: CanvasRenderingContext2D,
        style: string | CanvasGradient | CanvasPattern,
        isAxisX: boolean = true
    ): void {
        ctx.save();
        ctx.strokeStyle = style;
        ctx.lineWidth = this.axisLineLength;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        if (isAxisX) {
            ctx.lineTo(this.axisLength, 0);
        } else {
            ctx.lineTo(0, this.axisLength);
        }
        ctx.stroke();
        ctx.restore();
    }

    public beginDraw(
        transform: ITransformable,
        state: IRenderState,
        context: CanvasRenderingContext2D
    ): void {
        context.save();
        context.lineWidth = state.lineWidth;
        context.strokeStyle = state.strokeStyle;
        context.fillStyle = state.fillStyle;
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
        if (state.renderType === ERenderType.STROKE) {
            context.stroke();
        } else if (state.renderType === ERenderType.FILL) {
            context.fill();
        } else if (state.renderType === ERenderType.STROKE_FILL) {
            context.stroke();
            context.fill();
        } else if (state.renderType === ERenderType.CLIP) {
            context.clip();
        }
    }

    public endDraw(
        transform: ITransformable,
        state: IRenderState,
        context: CanvasRenderingContext2D
    ): void {
        if (state.renderType !== ERenderType.CLIP) {
            if (state.showCoordSystem) {
                this.drawLine(context, this.axisXStyle, true);
                this.drawLine(context, this.axisYStyle, false);
            }
        }
        context.restore();
    }
}
