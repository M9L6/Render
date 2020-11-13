import { Dictionary } from "../../../dataStruct/Dictionary";
import { GLTexture } from "./GLTexture";

export class GLTextureCache {
    public static instance: GLTextureCache = new GLTextureCache();

    private _dict: Dictionary<GLTexture>;

    private constructor() {
        this._dict = new Dictionary<GLTexture>();
    }

    public set(key: string, value: GLTexture): void {
        this._dict.insert(key, value);
    }

    public getMaybe(key: string): GLTexture | undefined {
        let ret: GLTexture | undefined = this._dict.find(key);
        return ret;
    }

    public getMust(key: string): GLTexture {
        let ret: GLTexture | undefined = this._dict.find(key);
        if (ret === undefined) {
            throw new Error(key + "对应的Program不存在");
        }
        return ret;
    }

    public remove(key: string): boolean {
        return this._dict.remove(key);
    }
}
