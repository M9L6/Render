import { EInputEventType } from "../game/input/CanvasInputEvent";
import { CanvasMouseEvent } from "../game/input/CanvasMouseEvent";
import { Math2D } from "../game/math/Math2D";
import { Vec2 } from "../game/math/Vec2";
import { SpriteFactory } from "../game/render/2d/manager/SpriteFactory";
import { ERenderType } from "../game/render/2d/objects/IRenderState";
import { EOrder, ISprite } from "../game/render/2d/objects/ISprite";
import { Inset } from "../game/render/2d/shapes/Inset";
import { IShape } from "../game/render/2d/shapes/IShape";
import { Scale9Dta } from "../game/render/2d/shapes/Scale9Data";
import { Sprite2DApplication } from "../game/Sprite2DApplication";

export class Shape_Hit_Draw_TestDemo {
    private _app: Sprite2DApplication;
    private _image: HTMLImageElement;
    private _shapes: IShape[] = [];
    private _idx: number;

    private _lastColor: string | CanvasGradient | CanvasPattern;

    constructor(app: Sprite2DApplication) {
        this._lastColor = "red";
        this._app = app;
        this._idx = 0;
        this._image = document.createElement("img");
        this._image.src = "./assets/images/fanyi.png";
        this._image.onload = (evt: Event): void => {
            this._createShapes();
            this._createSprites();
            this._app.start();
        };
    }

    private _createShapes(): void {
        this._shapes = [];

        this._shapes.push(
            SpriteFactory.createLine(Vec2.create(0, 0), Vec2.create(100, 0))
        );
        this._shapes.push(SpriteFactory.createXLine(100, 0.5));

        this._shapes.push(SpriteFactory.createRect(10, 10));
        this._shapes.push(SpriteFactory.createRect(10, 10, 0.5, 0.5));
        this._shapes.push(SpriteFactory.createRect(10, 10, 0.5, 0));
        this._shapes.push(SpriteFactory.createRect(10, 10, 0, 0.5));
        this._shapes.push(SpriteFactory.createRect(10, 10, -0.5, 0.5));

        this._shapes.push(SpriteFactory.createCircle(10));

        this._shapes.push(SpriteFactory.createEllipse(10, 20));

        let points: Vec2[] = [
            Vec2.create(20, 0),
            Vec2.create(10, 20),
            Vec2.create(-10, 20),
            Vec2.create(-20, 0),
            Vec2.create(-10, -20),
            Vec2.create(10, -20),
        ];

        this._shapes.push(SpriteFactory.createPolygon(points));

        let data: Scale9Dta = new Scale9Dta(this._image, new Inset(5, 5, 5, 5));

        this._shapes.push(
            SpriteFactory.createScale9Grid(data, 100, 80, 0.5, 0.5)
        );
    }

    private _createSprites(): void {
        let grid: IShape = SpriteFactory.createGrid(
            this._app.canvas.width,
            this._app.canvas.height
        );

        let gridSprite: ISprite = SpriteFactory.createSprite(grid, "grid");
        gridSprite.fillStyle = "white";
        gridSprite.strokeStyle = "black";
        this._app.rootContainer.addSprite(gridSprite);

        gridSprite.mouseEvent = (s: ISprite, evt: CanvasMouseEvent): void => {
            if (this._shapes.length === 0) {
                return;
            }
            if (evt.button === 2) {
                if (evt.type === EInputEventType.MOUSEUP) {
                    this._idx = this._idx % this._shapes.length;
                    let sprite: ISprite = SpriteFactory.createSprite(
                        this._shapes[this._idx]
                    );
                    sprite.x = evt.canvasPosition.x;
                    sprite.y = evt.canvasPosition.y;
                    if (sprite.shape.type !== "Scale9Grid") {
                        sprite.rotation = Math2D.random(-180, 180);
                    }

                    sprite.renderType = ERenderType.FILL;

                    if (this._shapes[this._idx].type === "Line") {
                        sprite.renderType = ERenderType.STROKE;
                        sprite.scaleX = Math2D.random(1, 2);
                        sprite.strokeStyle =
                            Math2D.Colors[
                                Math.floor(
                                    Math2D.random(3, Math2D.Colors.length)
                                )
                            ];
                    } else {
                        sprite.fillStyle =
                            Math2D.Colors[
                                Math.floor(
                                    Math2D.random(3, Math2D.Colors.length)
                                )
                            ];
                        if (this._shapes[this._idx].type === "Circle") {
                            let scale: number = Math2D.random(1, 3);
                            sprite.scaleX = scale;
                            sprite.scaleY = scale;
                        } else if (
                            this._shapes[this._idx].type === "Scale9Grid"
                        ) {
                            sprite.scaleX = Math2D.random(1, 3);
                            sprite.scaleY = Math2D.random(1, 3);
                        }
                    }
                    sprite.mouseEvent = this._mouseEventHandler.bind(this);
                    sprite.updateEvent = this._updateEventHandler.bind(this);
                    this._app.rootContainer.addSprite(sprite);
                    this._idx++;
                }
            }
        };
    }

    private _updateEventHandler(
        s: ISprite,
        msec: number,
        diff: number,
        order: EOrder
    ): void {
        if (order === EOrder.POSTORDER) {
            return;
        }

        if (
            s.shape.type !== "Circle" &&
            s.shape.type !== "Line" &&
            s.shape.type !== "Scale9Grid"
        ) {
            s.rotation += 100 * diff;
        }
    }

    private _mouseEventHandler(s: ISprite, evt: CanvasMouseEvent): void {
        if (evt.button === 0) {
            if (evt.type === EInputEventType.MOUSEDOWN) {
                if (s.shape.type === "Line") {
                    this._lastColor = s.strokeStyle;
                    s.strokeStyle = "red";
                    s.lineWidth = 10;
                } else {
                    this._lastColor = s.fillStyle;
                    s.fillStyle = "red";
                }
            } else if (evt.type === EInputEventType.MOUSEDRAG) {
                s.x = evt.canvasPosition.x;
                s.y = evt.canvasPosition.y;
            } else if (evt.type === EInputEventType.MOUSEUP) {
                if (s.shape.type === "Line") {
                    s.strokeStyle = this._lastColor;
                    s.lineWidth = 1;
                } else {
                    s.fillStyle = this._lastColor;
                }
            }
        }
    }
}
