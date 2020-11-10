import { Vec2 } from "../../../math/Vec2";
import { ITransformable } from "../objects/ITransformable";

export interface IHittable {
    hitTest(localPt: Vec2, transform: ITransformable): boolean;
}
