import { CanvasKeyBoardEvent } from "../game/input/CanvasKeyBoardEvent";
import { CanvasMouseEvent } from "../game/input/CanvasMouseEvent";
import { Vec2 } from "../game/math/Vec2";
import { SpriteFactory } from "../game/render/2d/manager/SpriteFactory";
import { ISprite } from "../game/render/2d/objects/ISprite";
import { IShape } from "../game/render/2d/shapes/IShape";
import { Sprite2DApplication } from "../game/Sprite2DApplication";

export class TankFollowBezierPathDemo{
    private _app:Sprite2DApplication;

    private _curvePts:Vec2[];
    private _bezierPath!:IShape;
    private _circle:IShape;
    private _rect:IShape;

    private _addPointEnd:boolean;
    private _speed:number;

    private _curveIndex:number;
    private _curveParamT:number;

    private _position:Vec2;
    private _lastPosition:Vec2;

    constructor(app:Sprite2DApplication){
        this._app = app;
        this._addPointEnd = false;

        this._curveIndex = 0;
        this._curveParamT = 0;

        this._position = Vec2.create();
        this._lastPosition = Vec2.create();

        this._speed = 5;
        this._curvePts = [];

        this._circle = SpriteFactory.createCircle(5);
        this._rect = SpriteFactory.createRect(10,10,0.5,0.5);

        if(this._app.rootContainer.sprite!==undefined){
            this._app.rootContainer.sprite.mouseEvent = this._mouseEvent.bind(this);
            this._app.rootContainer.sprite.keyEvent = this._keyEvent.bind(this);
        }
        this._app.start();

    }

    private _createBezierMarker(x:number,y:number,isCircle:boolean):void{
        
    }


    private _mouseEvent(spr:ISprite,evt:CanvasMouseEvent):void{

    }

    private _keyEvent(spr:ISprite,evt:CanvasKeyBoardEvent):void{

    }



}