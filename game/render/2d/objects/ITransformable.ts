import { Mat2D } from "../../../math/Mat2D";

export interface ITransformable {
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    getWorldMatrix(): Mat2D;
    getLocalMatrix(): Mat2D;
}
