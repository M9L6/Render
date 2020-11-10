import { Vec2 } from "../../../math/Vec2";
import { IRenderState } from "../objects/IRenderState";
import { ITransformable } from "../objects/ITransformable";
import { IShape } from "./IShape";

export class EndClipShape implements IShape {
    public data: any;
    public get type(): string {
        return "EndClipShape";
    }
    public hitTest(localPy: Vec2, transform: ITransformable): boolean {
        return false;
    }

    public beginDraw(
        transform: ITransformable,
        state: IRenderState,
        context: CanvasRenderingContext2D
    ): void {}

    public draw(
        transform: ITransformable,
        state: IRenderState,
        context: CanvasRenderingContext2D
    ): void {}

    public endDraw(
        transform: ITransformable,
        state: IRenderState,
        context: CanvasRenderingContext2D
    ): void {
        context.restore();
    }
}
