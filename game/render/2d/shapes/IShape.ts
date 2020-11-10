import { IDrawable } from "./IDrawable";
import { IHittable } from "./IHittable";

export interface IShape extends IHittable, IDrawable {
    readonly type: string;
    data: any;
}
