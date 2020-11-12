import { Dictionary } from "../../../dataStruct/Dictionary";
import { GLProgram } from "./GLProgram";

export class GLProgramCache {
    public static readonly instance: GLProgramCache = new GLProgramCache();

    private _dict: Dictionary<GLProgram>;

    private constructor() {
        this._dict = new Dictionary<GLProgram>();
        console.log("create new GLProgramCacher");
    }

    public set(key: string, value: GLProgram): void {
        this._dict.insert(key, value);
    }

    public getMaybe(key: string): GLProgram | undefined {
        let ret: GLProgram | undefined = this._dict.find(key);
        return ret;
    }

    public getMust(key: string): GLProgram {
        let ret: GLProgram | undefined = this._dict.find(key);
        if (ret === undefined) {
            throw new Error(key + "对应的Program不存在");
        }
        return ret;
    }

    public remove(key: string): boolean {
        return this._dict.remove(key);
    }
}
