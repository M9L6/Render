import { Math2D } from "./Math2D";
import mat4 from "./tsm/mat4";
import vec2 from "./tsm/vec2";
import vec3 from "./tsm/vec3";

export class GLWorldMatrixStack {
    private _worldMatrixStack: mat4[];

    public get worldMatrix(): mat4 {
        if (this._worldMatrixStack.length <= 0) {
            throw new Error("model matrix stack为空");
        }
        return this._worldMatrixStack[this._worldMatrixStack.length - 1];
    }

    constructor() {
        this._worldMatrixStack = [];
        this._worldMatrixStack.push(new mat4().setIdentity());
    }

    public pushMatrix(): GLWorldMatrixStack {
        let mv: mat4 = new mat4();
        this.worldMatrix.copy(mv);
        this._worldMatrixStack.push(mv);
        return this;
    }

    public popMatrix(): GLWorldMatrixStack {
        this._worldMatrixStack.pop();
        return this;
    }

    public loadIdentity(): GLWorldMatrixStack {
        this.worldMatrix.setIdentity();
        return this;
    }

    public loadMatrix(mat: mat4): GLWorldMatrixStack {
        mat.copy(this.worldMatrix);
        return this;
    }

    public multMatrix(mat: mat4): GLWorldMatrixStack {
        this.worldMatrix.multiply(mat);
        return this;
    }

    public translate(pos: vec3): GLWorldMatrixStack {
        this.worldMatrix.translate(pos);
        return this;
    }

    public rotate(
        angle: number,
        axis: vec3,
        isRadians: boolean = false
    ): GLWorldMatrixStack {
        if (isRadians === false) angle = Math2D.toRadian(angle);
        this.worldMatrix.rotate(angle, axis);
        return this;
    }

    public scale(s: vec3): GLWorldMatrixStack {
        this.worldMatrix.scale(s);
        return this;
    }
}
