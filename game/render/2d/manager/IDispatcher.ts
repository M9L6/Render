import { CanvasKeyBoardEvent } from "../../../input/CanvasKeyBoardEvent";
import { CanvasMouseEvent } from "../../../input/CanvasMouseEvent";
import { ISpriteContainer } from "./ISpriteContainer";

export interface IDispatcher {
    readonly container: ISpriteContainer;
    dispatchUpdate(msec: number, diffSec: number): void;
    dispatchDraw(context: CanvasRenderingContext2D): void;
    dispatchMouseEvent(evt: CanvasMouseEvent): void;
    dispatchKeyEvent(evt: CanvasKeyBoardEvent): void;
}
