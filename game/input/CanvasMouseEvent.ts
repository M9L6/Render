import { Vec2 } from "../math/Vec2";
import { CanvasInputEvent } from "./CanvasInputEvent";

export class CanvasMouseEvent extends CanvasInputEvent {
    public button: number;
    public canvasPosition: Vec2;
    public localPosition: Vec2;
    public hasLocalPosition: boolean;
    constructor(
        canvasPos: Vec2,
        button: number,
        altKey: boolean = false,
        ctrlKey: boolean = false,
        shiftKey: boolean = false
    ) {
        super(altKey, ctrlKey, shiftKey);
        this.canvasPosition = canvasPos;
        this.button = button;
        this.localPosition = Vec2.create();
        this.hasLocalPosition = false;
    }
}
