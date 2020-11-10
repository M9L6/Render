export enum ERenderType {
    CUSTOM,
    STROKE,
    FILL,
    STROKE_FILL,
    CLIP,
}
export interface IRenderState {
    isVisible: boolean;
    showCoordSystem: boolean;
    lineWidth: number;
    fillStyle: string | CanvasGradient | CanvasPattern;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    renderType: ERenderType;
}
