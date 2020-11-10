import { EInputEventType } from "../game/input/CanvasInputEvent";
import { CanvasKeyBoardEvent } from "../game/input/CanvasKeyBoardEvent";
import { CanvasMouseEvent } from "../game/input/CanvasMouseEvent";
import { Math2D } from "../game/math/Math2D";
import { Vec2 } from "../game/math/Vec2";
import { SpriteFactory } from "../game/render/2d/manager/SpriteFactory";
import { ERenderType } from "../game/render/2d/objects/IRenderState";
import { EOrder, ISprite } from "../game/render/2d/objects/ISprite";
import { IShape } from "../game/render/2d/shapes/IShape";
import { Sprite2DApplication } from "../game/Sprite2DApplication";

export class TankFollowBezierPathDemo {
    private _app: Sprite2DApplication;

    private _curvePts: Vec2[];
    private _bezierPath!: IShape;
    private _circle: IShape;
    private _rect: IShape;

    private _addPointEnd: boolean;
    private _speed: number;

    private _curveIndex: number;
    private _curveParamT: number;

    private _position: Vec2;
    private _lastPosition: Vec2;

    constructor(app: Sprite2DApplication) {
        this._app = app;
        this._addPointEnd = false;

        this._curveIndex = 0;
        this._curveParamT = 0;

        this._position = Vec2.create();
        this._lastPosition = Vec2.create();

        this._speed = 5;
        this._curvePts = [];

        this._circle = SpriteFactory.createCircle(5);
        this._rect = SpriteFactory.createRect(10, 10, 0.5, 0.5);

        if (this._app.rootContainer.sprite !== undefined) {
            this._app.rootContainer.sprite.mouseEvent = this._mouseEvent.bind(
                this
            );
            this._app.rootContainer.sprite.keyEvent = this._keyEvent.bind(this);
        }
        this._app.start();
    }

    private _createBezierMarker(x: number, y: number, isCircle: boolean): void {
        let idx: number = this._curvePts.length;
        this._curvePts.push(Vec2.create(x, y));
        let sprite: ISprite;
        if (isCircle) {
            sprite = SpriteFactory.createSprite(this._circle);
            sprite.fillStyle = "blue";
        } else {
            sprite = SpriteFactory.createSprite(this._rect);
            sprite.fillStyle = "red";
        }
        sprite.x = x;
        sprite.y = y;
        sprite.name = "curvePt" + this._curvePts.length;

        this._app.rootContainer.addSprite(sprite);
        sprite.mouseEvent = (spr: ISprite, evt: CanvasMouseEvent): void => {
            if (evt.type === EInputEventType.MOUSEDRAG) {
                spr.x = evt.canvasPosition.x;
                spr.y = evt.canvasPosition.y;
                this._curvePts[idx].x = spr.x;
                this._curvePts[idx].y = spr.y;
            }
        };
    }

    private _createLine(start: Vec2, end: Vec2, idx: number): void {
        let line: ISprite = SpriteFactory.createSprite(
            SpriteFactory.createLine(start, end)
        );
        line.lineWidth = 2;
        line.strokeStyle = "green";
        line.name = "line" + idx;
        this._app.rootContainer.addSprite(line);
    }

    private _createBezierPath(): void {
        this._bezierPath = SpriteFactory.createBezierPath(this._curvePts);
        let spr: ISprite = SpriteFactory.createSprite(this._bezierPath);
        spr.strokeStyle = "blue";
        spr.renderType = ERenderType.STROKE;
        spr.name = "bezierPath";
        this._app.rootContainer.addSprite(spr);

        for (let i = 1; i < this._curvePts.length; i++) {
            this._createLine(this._curvePts[i - 1], this._curvePts[i], i);
        }
    }

    private _createTank(
        x: number,
        y: number,
        w: number,
        h: number,
        gunLength: number
    ): void {
        let shape: IShape = SpriteFactory.createRect(w, h, 0.5, 0.5);
        let tank: ISprite = SpriteFactory.createSprite(shape);
        tank.x = x;
        tank.y = y;
        tank.fillStyle = "grey";
        tank.name = "tank";
        this._app.rootContainer.addSprite(tank);

        tank.renderType = ERenderType.CLIP;

        shape = SpriteFactory.createEllipse(15, 10);
        let turret: ISprite = SpriteFactory.createSprite(shape);
        turret.fillStyle = "red";
        turret.name = "turret";
        turret.keyEvent = this._keyEvent.bind(this);
        tank.owner.addSprite(turret);

        tank.owner.addSprite(SpriteFactory.createClipSprite());

        shape = SpriteFactory.createLine(
            Vec2.create(0, 0),
            Vec2.create(gunLength, 0)
        );
        let gun: ISprite = SpriteFactory.createSprite(shape);
        gun.strokeStyle = "blue";
        gun.lineWidth = 3;
        gun.name = "gun";
        turret.owner.addSprite(gun);

        gun.renderEvent = this._renderEvent.bind(this);

        tank.updateEvent = this._updateEvent.bind(this);
    }

    private _getCurveCount(): number {
        let n = this._curvePts.length;
        if (n <= 3) throw new Error("顶点数量必须大于3");
        return (n - 1) / 2;
    }

    private _updateCurveIndex(diffSec: number): void {
        this._curveParamT += this._speed * diffSec;
        if (this._curveParamT >= 1.0) {
            this._curveIndex++;
            this._curveParamT = this._curveParamT % 1.0;
        }
        if (this._curveIndex >= this._getCurveCount()) {
            this._curveIndex = 0;
        }
    }

    private _updateEvent(
        spr: ISprite,
        msec: number,
        diffSec: number,
        order: EOrder
    ): void {
        if (order === EOrder.PREORDER) {
            this._updateCurveIndex(diffSec * 0.1);
            let a0: Vec2 = this._curvePts[this._curveIndex * 2];
            let a1: Vec2 = this._curvePts[this._curveIndex * 2 + 1];
            let a2: Vec2 = this._curvePts[this._curveIndex * 2 + 2];
            Vec2.copy(this._position, this._lastPosition);
            Math2D.getQuadraticBezierVector(
                a0,
                a1,
                a2,
                this._curveParamT,
                this._position
            );
            spr.x = this._position.x;
            spr.y = this._position.y;

            spr.rotation = Vec2.getOrientation(
                this._lastPosition,
                this._position,
                false
            );
        }
    }

    private _renderEvent(
        spr: ISprite,
        context: CanvasRenderingContext2D,
        order: EOrder
    ): void {
        if (order === EOrder.POSTORDER) {
            context.save();
            context.translate(100, 0);
            context.beginPath();
            context.arc(0, 0, 5, 0, Math.PI * 2);
            context.fill();
            context.restore();
        } else {
            context.save();
            context.translate(80, 0);
            context.fillRect(-5, -5, 10, 10);
            context.restore();
        }
    }

    private _mouseEvent(spr: ISprite, evt: CanvasMouseEvent): void {
        if (evt.type === EInputEventType.MOUSEDOWN) {
            if (spr === this._app.rootContainer.sprite) {
                if (this._addPointEnd) return;
            }
            if (this._curvePts.length % 2 === 0) {
                this._createBezierMarker(
                    evt.canvasPosition.x,
                    evt.canvasPosition.y,
                    true
                );
            } else {
                this._createBezierMarker(
                    evt.canvasPosition.x,
                    evt.canvasPosition.y,
                    false
                );
            }
        }
    }

    private _keyEvent(spr: ISprite, evt: CanvasKeyBoardEvent): void {
        if (evt.type === EInputEventType.KEYUP) {
            if (evt.key === "e") {
                if (this._addPointEnd) {
                    return;
                }
                if (this._curvePts.length > 3) {
                    if ((this._curvePts.length - 1) % 2 > 0) {
                        this._curvePts.push(this._curvePts[0]);
                        this._addPointEnd = true;
                        this._createBezierPath();
                        this._position.x = this._curvePts[0].x;
                        this._position.y = this._curvePts[0].y;
                        this._createTank(
                            this._position.x,
                            this._position.y,
                            80,
                            50,
                            80
                        );
                    }
                }
            } else if (evt.key === "r") {
                if (this._addPointEnd) {
                    this._addPointEnd = false;
                    this._curvePts = [];
                    this._app.rootContainer.removeAll(false);
                }
            }
        } else if (evt.type === EInputEventType.KEYPRESS) {
            if (evt.key === "a") {
                if (this._addPointEnd) {
                    if (spr.name === "turret") {
                        spr.rotation += 5;
                    }
                }
            } else if (evt.key === "s") {
                if (this._addPointEnd) {
                    if (spr.name === "turret") {
                        spr.rotation -= 5;
                    }
                }
            }
        }
    }
}
