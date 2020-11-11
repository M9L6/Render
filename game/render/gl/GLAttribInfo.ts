import { EGLSLESDataType } from "../../helper/GLHelper";

export class GLAttribInfo {
    public size: number;
    public type: EGLSLESDataType;
    public location: number;
    constructor(size: number, type: EGLSLESDataType, loc: number) {
        this.size = size;
        this.type = type;
        this.location = loc;
    }
}
