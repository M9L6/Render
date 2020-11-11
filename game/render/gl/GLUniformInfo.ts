import { EGLSLESDataType } from "../../helper/GLHelper";

export class GLUniformInfo {
    public size: number;
    public type: EGLSLESDataType;
    public location: WebGLUniformLocation;
    constructor(
        size: number,
        type: EGLSLESDataType,
        loc: WebGLUniformLocation
    ) {
        this.size = size;
        this.type = type;
        this.location = loc;
    }
}
