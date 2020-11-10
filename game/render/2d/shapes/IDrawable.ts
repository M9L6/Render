import { IRenderState } from "../objects/IRenderState";
import { ITransformable } from "../objects/ITransformable";

export interface IDrawable {
    beginDraw(
        transformable: ITransformable,
        state: IRenderState,
        context: CanvasRenderingContext2D
    ): void;
    draw(
        transformable: ITransformable,
        state: IRenderState,
        context: CanvasRenderingContext2D
    ): void;
    endDraw(
        transformable: ITransformable,
        state: IRenderState,
        context: CanvasRenderingContext2D
    ): void;
}
