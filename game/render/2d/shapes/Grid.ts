import { ERenderType, IRenderState } from "../objects/IRenderState";
import { ITransformable } from "../objects/ITransformable";
import { Rect } from "./Rect";

export class Grid extends Rect {
    public xStep: number;
    public yStep: number;
    constructor(w: number = 10, h: number, xStep: number, yStep: number) {
        super(w, h, 0, 0);
        this.xStep = xStep;
        this.yStep = yStep;
    }

    public draw(
        transform: ITransformable,
        state: IRenderState,
        context: CanvasRenderingContext2D
    ): void {
        state.renderType = ERenderType.CUSTOM;
        context.fillRect(0, 0, this.width, this.height);
        context.beginPath();
        for (let i = this.xStep + 0.5; i < this.width; i += this.xStep) {
            context.moveTo(i, 0);
            context.lineTo(i, this.height);
        }
        for (let i = this.yStep + 0.5; i < this.height; i += this.yStep) {
            context.moveTo(0, i);
            context.lineTo(this.width, i);
        }
        context.stroke();
    }

    public get type(): string {
        return "Grid";
    }
}
