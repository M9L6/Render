import { EInputEventType } from "../game/input/CanvasInputEvent";
import { CanvasKeyBoardEvent } from "../game/input/CanvasKeyBoardEvent";
import { CanvasMouseEvent } from "../game/input/CanvasMouseEvent";
import { Vec2 } from "../game/math/Vec2";
import { ISpriteContainer } from "../game/render/2d/manager/ISpriteContainer";
import { SpriteFactory } from "../game/render/2d/manager/SpriteFactory";
import { EOrder, ISprite } from "../game/render/2d/objects/ISprite";
import { IShape } from "../game/render/2d/shapes/IShape";
import { Sprite2DApplication } from "../game/Sprite2DApplication";

export class SkeletonPersonTets {
    private _app: Sprite2DApplication;
    private _skeletonPerson!: ISprite;
    private _bone: IShape;
    private _boneLen: number;
    private _armScale: number;
    private _hand_foot_Scale: number;
    private _legScale: number;
    private _hittedBoneSprite: ISprite | null;

    constructor(app: Sprite2DApplication) {
        this._app = app;
        this._hittedBoneSprite = null;
        this._boneLen = 60;
        this._armScale = 0.8;
        this._hand_foot_Scale = 0.4;
        this._legScale = 1.5;
        this._bone = SpriteFactory.createBone(this._boneLen, 0);
        this._createSkeleton();
        this._app.start();
    }

    private _createBoneSprite(
        scale: number,
        rotation: number,
        parent: ISpriteContainer,
        name: string = ""
    ): ISprite {
        let spr: ISprite = SpriteFactory.createSprite(this._bone);
        spr.lineWidth = 2;
        spr.strokeStyle = "red";
        spr.rotation = rotation;
        spr.scaleX = scale;
        spr.name = name;
        parent.addSprite(spr);
        spr.mouseEvent = this._mouseEvent.bind(this);
        spr.renderEvent = this._renderEvent.bind(this);
        return spr;
    }

    private _createSkeleton(x: number = 200, y: number = 200): void {
        let spr: ISprite;
        this._skeletonPerson = this._createBoneSprite(
            1.0,
            -90,
            this._app.rootContainer,
            "person"
        );
        this._skeletonPerson.x = x;
        this._skeletonPerson.y = y;

        let circle: IShape = SpriteFactory.createCircle(10);
        spr = SpriteFactory.createSprite(circle);
        spr.x = this._boneLen;
        spr.y = 0;
        spr.fillStyle = "blue";
        spr.rotation = 0;
        this._skeletonPerson.owner.addSprite(spr);

        spr = this._createBoneSprite(
            this._armScale,
            -90,
            this._skeletonPerson.owner
        );
        spr = this._createBoneSprite(this._hand_foot_Scale, -90, spr.owner);
        spr.x = this._boneLen;

        spr = this._createBoneSprite(
            this._armScale,
            90,
            this._skeletonPerson.owner
        );
        spr = this._createBoneSprite(this._hand_foot_Scale, 90, spr.owner);
        spr.x = this._boneLen;

        spr = this._createBoneSprite(
            this._legScale,
            -160,
            this._skeletonPerson.owner
        );
        spr = this._createBoneSprite(this._hand_foot_Scale, 70, spr.owner);
        spr.x = this._boneLen;

        spr = this._createBoneSprite(
            this._legScale,
            160,
            this._skeletonPerson.owner
        );
        spr = this._createBoneSprite(this._hand_foot_Scale, -70, spr.owner);
        spr.x = this._boneLen;

        if (this._app.rootContainer.sprite !== undefined) {
            this._app.rootContainer.sprite.mouseEvent = this._mouseEvent.bind(
                this
            );
            this._app.rootContainer.sprite.keyEvent = this._keyEvent.bind(this);
        }
    }

    private _mouseEvent(s: ISprite, evt: CanvasMouseEvent): void {
        if (evt.button === 0) {
            if (evt.type === EInputEventType.MOUSEDOWN) {
                if (s === this._app.rootContainer.sprite) {
                    if (this._hittedBoneSprite !== null) {
                        this._hittedBoneSprite.strokeStyle = "red";
                        this._hittedBoneSprite.lineWidth = 2;
                    }
                } else if (this._hittedBoneSprite !== s) {
                    if (this._hittedBoneSprite !== null) {
                        this._hittedBoneSprite.strokeStyle = "red";
                        this._hittedBoneSprite.lineWidth = 2;
                    }
                    this._hittedBoneSprite = s;
                    this._hittedBoneSprite.strokeStyle = "green";
                    this._hittedBoneSprite.lineWidth = 4;
                }
            } else if (evt.type === EInputEventType.MOUSEDRAG) {
                if (s === this._skeletonPerson) {
                    s.x = evt.canvasPosition.x;
                    s.y = evt.canvasPosition.y;
                }
            }
        }
    }

    private _keyEvent(sp: ISprite, evt: CanvasKeyBoardEvent): void {
        if (this._hittedBoneSprite === null) {
            return;
        }
        if (evt.type === EInputEventType.KEYPRESS) {
            if (evt.key === "f") {
                this._hittedBoneSprite.rotation += 1;
            } else if (evt.key === "b") {
                this._hittedBoneSprite.rotation -= 1;
            }
        }
    }

    private _renderEvent(
        spr: ISprite,
        context: CanvasRenderingContext2D,
        renderOrder: EOrder
    ): void {
        if (renderOrder === EOrder.PREORDER) return;
        let worldMat = spr.getWorldMatrix();
        let origin: Vec2 = Vec2.create(worldMat.values[4], worldMat.values[5]);
        context.save();
        context.setTransform(1, 0, 0, 1, origin.x, origin.y);
        context.beginPath();
        context.fillStyle = "green";
        context.arc(0, 0, 5, 0, Math.PI * 2, true);
        context.fill();
        context.restore();
    }
}
