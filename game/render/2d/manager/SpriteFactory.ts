import { IShape } from "../shapes/IShape";
import { ISprite } from "../objects/ISprite";
import { Sprite2D } from "../objects/Sprite2D";
import { Line } from "../shapes/Line";
import { Vec2 } from "../../../math/Vec2";
import { Grid } from "../shapes/Grid";
import { Circle } from "../shapes/Circle";
import { Rect } from "../shapes/Rect";
import { Ellipse } from "../shapes/Ellipse";
import { ConvexPolygon } from "../shapes/ConvexPolygon";
import { Scale9Dta } from "../shapes/Scale9Data";
import { Scale9Grid } from "../shapes/Scale9Grid";
import { Bone } from "../shapes/Bone";
import { BezierPath } from "../shapes/BezierPath";
import { EndClipShape } from "../shapes/EndClipShape";
import { ERenderType } from "../objects/IRenderState";

export class SpriteFactory {
    public static endClipShape: IShape = new EndClipShape();

    public static createSprite(shape: IShape, name: string = ""): ISprite {
        let spr: ISprite = new Sprite2D(shape, name);
        return spr;
    }

    public static createLine(start: Vec2, end: Vec2): IShape {
        let line: Line = new Line();
        line.start = start;
        line.end = end;
        return line;
    }

    public static createXLine(len: number = 10, t: number = 0): IShape {
        return new Line(len, t);
    }

    public static createGrid(
        w: number,
        h: number,
        xStep: number = 10,
        yStep: number = 10
    ): IShape {
        return new Grid(w, h, xStep, yStep);
    }

    public static createCircle(radius: number): Circle {
        return new Circle(radius);
    }

    public static createRect(
        w: number,
        h: number,
        u: number = 0,
        v: number = 0
    ): IShape {
        return new Rect(w, h, u, v);
    }

    public static createEllipse(radiusX: number, radiusY: number): IShape {
        return new Ellipse(radiusX, radiusY);
    }

    public static createPolygon(points: Vec2[]): IShape {
        if (points.length < 3) {
            throw new Error("多边形顶点数量必须大于等于3");
        }
        return new ConvexPolygon(points);
    }

    public static createScale9Grid(
        data: Scale9Dta,
        w: number,
        h: number,
        u: number = 0,
        v: number = 0
    ): IShape {
        return new Scale9Grid(data, w, h, u, v);
    }

    public static createBone(len: number, t: number): IShape {
        return new Bone(len, t);
    }

    public static createBezierPath(
        points: Vec2[],
        isCubic: boolean = false
    ): IShape {
        return new BezierPath(points, isCubic);
    }

    public static createClipSprite(name: string = ""): ISprite {
        let spr = new Sprite2D(SpriteFactory.endClipShape, name);
        spr.renderType = ERenderType.CLIP;
        return spr;
    }
}
