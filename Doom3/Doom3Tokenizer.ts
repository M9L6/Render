namespace Doom3 {
    export interface IDoom3Tokenizer extends IEnumerator<IDoom3Token> {
        setSource(source: string): void;
        reset(): void;
        getNextToken(token: IDoom3Token): boolean;
    }

    export class Doom3Tokenizer implements IDoom3Tokenizer {
        private _current: IDoom3Token = new Doom3Token();
        public get current(): IDoom3Token {
            return this._current;
        }
        private _source: string = "Doom3Tokenizer";
        private _curIdx: number = 0;
        private _digits: string[] = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
        ];
        private _whiteSpaces: string[] = [" ", "\t", "\v", "\n"];

        constructor() {}

        public moveNext(): boolean {
            return this.getNextToken(this._current);
        }

        private _isDigit(c: string): boolean {
            for (let i: number = 0; i < this._digits.length; i++) {
                if (c === this._digits[i]) {
                    return true;
                }
            }
            return false;
        }

        private _isWhitespace(c: string): boolean {
            for (let i: number = 0; i < this._whiteSpaces.length; i++) {
                if (c === this._whiteSpaces[i]) {
                    return true;
                }
            }
            return false;
        }

        private _isSpecialChar(c: string): boolean {
            switch (c) {
                case "(":
                case ")":
                case "[":
                case "]":
                case "{":
                case "}":
                case ",":
                case ".":
                    return true;
            }
            return false;
        }

        private _getChar(): string {
            if (this._curIdx >= 0 && this._curIdx < this._source.length) {
                return this._source.charAt(this._curIdx++);
            }
            return "";
        }

        private _peekChar(): string {
            if (this._curIdx >= 0 && this._curIdx < this._source.length) {
                return this._source.charAt(this._curIdx);
            }
            return "";
        }

        private _ungetChar(): void {
            if (this._curIdx > 0) {
                --this._curIdx;
            }
        }

        private _getNumber(token: Doom3Token): void {
            let val: number = 0.0;
            let isFloat: boolean = false;
            let scaleValue: number = 0.1;
            let c: string = this._getChar();
            let isNeagte: Boolean = c === "-";
            let consumed: boolean = false;
            let asciio0 = "0".charCodeAt(0);
            do {
                token.addChar(c);
                if (c === ".") {
                    isFloat = true;
                } else if (c !== "-") {
                    let ascii: number = c.charCodeAt(0);
                    let vc: number = ascii - asciio0;
                    if (!isFloat) {
                        val = 10 * val + vc;
                    } else {
                        val = val + scaleValue * vc;
                        scaleValue *= 0.1;
                    }
                } /*else{
                    console.log("运行到此处的只能是: "+c);
                }*/

                if (consumed === true) {
                    this._getChar();
                }
                c = this._peekChar();
                consumed = true;
            } while (
                (c.length > 0 && this._isDigit(c)) ||
                (!isFloat && c === ".")
            );
            if (isNeagte) {
                val = -val;
            }
            token.setVal(val);
        }

        private _getSubString(token: Doom3Token, endChar: string): void {
            let end: boolean = false;
            let c: string = "";
            token.setType(ETokenType.STRING);
            do {
                c = this._getChar();
                if (c === endChar) {
                    end = true;
                } else {
                    token.addChar(c);
                }
            } while (c.length > 0 && c !== "\n" && !end);
        }

        private _getString(token: Doom3Token): void {
            let c: string = this._getChar();
            token.setType(ETokenType.STRING);
            do {
                token.addChar(c);
                if (!this._isSpecialChar(c)) {
                    c = this._getChar();
                }
            } while (
                c.length > 0 &&
                !this._isWhitespace(c) &&
                !this._isSpecialChar(c)
            );
        }

        private _skipWhitespace(): string {
            let c: string = "";
            do {
                c = this._getChar();
            } while (c.length > 0 && this._isWhitespace(c));
            return c;
        }

        private _skipComments0(): string {
            let c: string = "";
            do {
                c = this._getChar();
            } while (c.length > 0 && c !== "\n");
            return c;
        }

        private _skipComments1(): string {
            let c: string = "";
            c = this._getChar();
            do {
                c = this._getChar();
            } while (c.length > 0 && (c !== "*" || this._peekChar() !== "/"));
            c = this._getChar();
            return c;
        }

        public setSource(source: string): void {
            this._source = source;
            this._curIdx = 0;
        }

        public reset(): void {
            this._curIdx = 0;
        }

        public getNextToken(tok: IDoom3Token): boolean {
            let token: Doom3Token = tok as Doom3Token;
            let c: string = "";
            token.reset();
            do {
                c = this._skipWhitespace();
                if (c === "/" && this._peekChar() === "/") {
                    c = this._skipComments0();
                } else if (c === "/" && this._peekChar() === "*") {
                    c = this._skipComments1();
                } else if (
                    this._isDigit(c) ||
                    c === "-" ||
                    (c === "." && this._isDigit(this._peekChar()))
                ) {
                    this._ungetChar();
                    this._getNumber(token);
                    return true;
                } else if (c.length > 0) {
                    this._ungetChar();
                    this._getString(token);
                    return true;
                }
            } while (c.length > 0);
            return false;
        }
    }
}
