namespace Doom3 {
    export enum ETokenType {
        NONE,
        STRING,
        NUMBER,
    }

    export interface IDoom3Token {
        reset(): void;
        isString(str: string): boolean;
        readonly type: ETokenType;
        getString(): string;
        getFloat(): number;
        getInt(): number;
    }

    export class Doom3Token implements IDoom3Token {
        private _type: ETokenType;
        public get type(): ETokenType {
            return this._type;
        }
        private _charArr: string[] = [];
        private _val: number;

        constructor() {
            this._charArr.length = 0;
            this._type = ETokenType.NONE;
            this._val = 0;
        }

        public reset(): void {
            this._charArr.length = 0;
            this._type = ETokenType.NONE;
            this._val = 0;
        }

        public getString(): string {
            return this._charArr.join("");
        }

        public getFloat(): number {
            return this._val;
        }

        public getInt(): number {
            return parseInt(this._val.toString(), 10);
        }

        public isString(str: string): boolean {
            let count: number = this._charArr.length;
            if (str.length !== count) {
                return false;
            }

            for (let i: number = 0; i < count; i++) {
                if (this._charArr[i] !== str[i]) {
                    return false;
                }
            }
            return true;
        }

        public addChar(c: string): void {
            this._charArr.push(c);
        }

        public setVal(num: number): void {
            this._val = num;
            this._type = ETokenType.NUMBER;
        }

        public setType(type: ETokenType): void {
            this._type = type;
        }
    }
}
