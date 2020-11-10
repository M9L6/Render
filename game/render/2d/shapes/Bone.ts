import { Mat2D } from "../../../math/Mat2D";
import { IRenderState } from "../objects/IRenderState";
import { ITransformable } from "../objects/ITransformable";
import { Line } from "./Line";

export class Bone extends Line {
    public get type(): string {
        return "Bone";
    }

    public endDraw(
        transform: ITransformable,
        state: IRenderState,
        context: CanvasRenderingContext2D
    ): void {
        super.endDraw(transform, state, context);
        context.save();
        let mat: Mat2D = transform.getWorldMatrix();
        context.setTransform(1, 0, 0, 1, mat.values[4], mat.values[5]);
        context.beginPath();
        context.fillStyle = "blue";
        context.arc(this.start.x, this.start.y, 5, 0, Math.PI, true);
        context.fill();
        context.restore();
    }
}
