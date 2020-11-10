namespace Doom3 {
    export class Doom3Factory {
        public static createDoom3Tokenizer(): IDoom3Tokenizer {
            let ret: IDoom3Tokenizer = new Doom3Tokenizer();
            return ret;
        }
    }
}
