import { CanvasKeyBoardEvent } from "../../../input/CanvasKeyBoardEvent";
import { CanvasMouseEvent } from "../../../input/CanvasMouseEvent";
import { Vec2 } from "../../../math/Vec2";
import { IRenderState } from "./IRenderState";
import { IShape } from "../shapes/IShape";
import { ISpriteContainer } from "../manager/ISpriteContainer";
import { ITransformable } from "./ITransformable";

export enum EOrder {
    PREORDER,
    POSTORDER,
}

export type UpdateEventHandler = (
    spr: ISprite,
    msec: number,
    diffSec: number,
    travelOrder: EOrder
) => void;

export type MouseEventHandler = (sp: ISprite, evt: CanvasMouseEvent) => void;

export type KeyboardEventHandler = (
    sp: ISprite,
    evt: CanvasKeyBoardEvent
) => void;

export type RenderEventHandler = (
    sp: ISprite,
    context: CanvasRenderingContext2D,
    renderOrder: EOrder
) => void;

export interface ISprite extends ITransformable, IRenderState {
    name: string;
    shape: IShape;
    owner: ISpriteContainer;
    data: any;
    hitTest(localPt: Vec2): boolean;
    update(msec: number, diff: number, order: EOrder): void;

    mouseEvent: MouseEventHandler | null;
    keyEvent: KeyboardEventHandler | null;
    updateEvent: UpdateEventHandler | null;
    renderEvent: RenderEventHandler | null;
}
