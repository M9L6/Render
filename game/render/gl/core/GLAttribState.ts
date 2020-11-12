export type GLAttribOffsetMap = { [key: string]: number };
export type GLAttribBits = number;
export class GLAttribState {
    public static readonly POSITION_BIT: number = 1 << 0;
    public static readonly POSITION_COMPONENT: number = 3;
    public static readonly POSITION_NAME: string = "aPosition";
    public static readonly POSITION_LOCATION: number = 0;

    public static readonly TEXCOORD_BIT: number = 1 << 1;
    public static readonly TEXCOORD_COMPONENT: number = 2;
    public static readonly TEXCOORD_NAME: string = "aTexCoord";
    public static readonly TEXCOORD_LOCATION: number = 1;

    public static readonly TEXCOORD1_BIT: number = 1 << 2;
    public static readonly TEXCOORD1_COMPONENT: number = 2;
    public static readonly TEXCOORD1_NAME: string = "aTexCoord1";
    public static readonly TEXCOORD1_LOCATION: number = 2;

    public static readonly NORMAL_BIT: number = 1 << 3;
    public static readonly NORMAL_COMPONENT: number = 3;
    public static readonly NORMAL_NAME: string = "aNormal";
    public static readonly NORMAL_LOCATION: number = 3;

    public static readonly TANGENT_BIT: number = 1 << 4;
    public static readonly TANGENT_COMPONENT: number = 4;
    public static readonly TANGENT_NAME: string = "aTangent";
    public static readonly TANGENT_LOCATION: number = 4;

    public static readonly COLOR_BIT: number = 1 << 5;
    public static readonly COLOR_COMPONENT: number = 4;
    public static readonly COLOR_NAME: string = "aColor";
    public static readonly COLOR_LOCATION: number = 5;

    public static readonly ATTRIBSTRIDE: string = "STRIDE";
    public static readonly ATTRIBBYTELENGTH: string = "BYTELENGTH";

    public static readonly FLOAT32_SIZE = Float32Array.BYTES_PER_ELEMENT;
    public static readonly UINT16_SIZE = Uint16Array.BYTES_PER_ELEMENT;

    public static makeVertexAttribs(
        useTexcoord0: boolean,
        useTexcoord1: boolean,
        useNormal: boolean,
        useTangent: boolean,
        useColor: boolean
    ): GLAttribBits {
        let bits: number = GLAttribState.POSITION_BIT;
        if (useTexcoord0) bits |= GLAttribState.TEXCOORD_BIT;
        if (useTexcoord1) bits |= GLAttribState.TEXCOORD1_BIT;
        if (useNormal) bits |= GLAttribState.NORMAL_BIT;
        if (useTangent) bits |= GLAttribState.TANGENT_BIT;
        if (useColor) bits |= GLAttribState.COLOR_BIT;
        return bits;
    }

    public static hasPostion(bits: GLAttribBits): boolean {
        return (bits & GLAttribState.POSITION_BIT) !== 0;
    }
    public static hasNormal(bits: GLAttribBits): boolean {
        return (bits & GLAttribState.NORMAL_BIT) !== 0;
    }
    public static hasTangent(bits: GLAttribBits): boolean {
        return (bits & GLAttribState.TANGENT_BIT) !== 0;
    }
    public static hasColor(bits: GLAttribBits): boolean {
        return (bits & GLAttribState.COLOR_BIT) !== 0;
    }
    public static hasTexcoord(bits: GLAttribBits): boolean {
        return (bits & GLAttribState.TEXCOORD_BIT) !== 0;
    }
    public static hasTexcoord1(bits: GLAttribBits): boolean {
        return (bits & GLAttribState.TEXCOORD1_BIT) !== 0;
    }

    public static getInterleavedLayoutAttribOffsetMap(
        bits: GLAttribBits
    ): GLAttribOffsetMap {
        let offsets: GLAttribOffsetMap = {};
        let byteOffset: number = 0;
        if (GLAttribState.hasPostion(bits)) {
            offsets[GLAttribState.POSITION_NAME] = 0;
            byteOffset +=
                GLAttribState.POSITION_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasNormal(bits)) {
            offsets[GLAttribState.NORMAL_NAME] = byteOffset;
            byteOffset +=
                GLAttribState.NORMAL_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasTexcoord(bits)) {
            offsets[GLAttribState.TEXCOORD_NAME] = byteOffset;
            byteOffset +=
                GLAttribState.TEXCOORD_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasTexcoord1(bits)) {
            offsets[GLAttribState.TEXCOORD1_NAME] = byteOffset;
            byteOffset +=
                GLAttribState.TEXCOORD1_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasColor(bits)) {
            offsets[GLAttribState.COLOR_NAME] = byteOffset;
            byteOffset +=
                GLAttribState.COLOR_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasTangent(bits)) {
            offsets[GLAttribState.TANGENT_NAME] = byteOffset;
            byteOffset +=
                GLAttribState.TANGENT_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        offsets[GLAttribState.ATTRIBSTRIDE] = byteOffset;
        offsets[GLAttribState.ATTRIBBYTELENGTH] = byteOffset;

        return offsets;
    }

    public static getSequencedLayoutAttribOffsetMap(
        bits: GLAttribBits,
        vertexCount: number
    ): GLAttribOffsetMap {
        let offsets: GLAttribOffsetMap = {};
        let byteOffset: number = 0;
        if (GLAttribState.hasPostion(bits)) {
            offsets[GLAttribState.POSITION_NAME] = 0;
            byteOffset +=
                vertexCount *
                GLAttribState.POSITION_COMPONENT *
                GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasNormal(bits)) {
            offsets[GLAttribState.NORMAL_NAME] = byteOffset;
            byteOffset +=
                vertexCount *
                GLAttribState.NORMAL_COMPONENT *
                GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasTexcoord(bits)) {
            offsets[GLAttribState.TEXCOORD_NAME] = byteOffset;
            byteOffset +=
                vertexCount *
                GLAttribState.TEXCOORD_COMPONENT *
                GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasTexcoord1(bits)) {
            offsets[GLAttribState.TEXCOORD1_NAME] = byteOffset;
            byteOffset +=
                vertexCount *
                GLAttribState.TEXCOORD1_COMPONENT *
                GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasColor(bits)) {
            offsets[GLAttribState.COLOR_NAME] = byteOffset;
            byteOffset +=
                vertexCount *
                GLAttribState.COLOR_COMPONENT *
                GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasTangent(bits)) {
            offsets[GLAttribState.TANGENT_NAME] = byteOffset;
            byteOffset +=
                vertexCount *
                GLAttribState.TANGENT_COMPONENT *
                GLAttribState.FLOAT32_SIZE;
        }
        offsets[GLAttribState.ATTRIBSTRIDE] = byteOffset / vertexCount;
        offsets[GLAttribState.ATTRIBBYTELENGTH] = byteOffset;

        return offsets;
    }

    public static getSepratedLayoutAttribOffsetMap(
        bits: GLAttribBits
    ): GLAttribOffsetMap {
        let offsets: GLAttribOffsetMap = {};
        let byteOffset: number = 0;
        if (GLAttribState.hasPostion(bits)) {
            offsets[GLAttribState.POSITION_NAME] = 0;
        }
        if (GLAttribState.hasNormal(bits)) {
            offsets[GLAttribState.NORMAL_NAME] = byteOffset;
        }
        if (GLAttribState.hasTexcoord(bits)) {
            offsets[GLAttribState.TEXCOORD_NAME] = byteOffset;
        }
        if (GLAttribState.hasTexcoord1(bits)) {
            offsets[GLAttribState.TEXCOORD1_NAME] = byteOffset;
        }
        if (GLAttribState.hasColor(bits)) {
            offsets[GLAttribState.COLOR_NAME] = byteOffset;
        }
        if (GLAttribState.hasTangent(bits)) {
            offsets[GLAttribState.TANGENT_NAME] = byteOffset;
        }

        return offsets;
    }

    public static getVertexByteStride(bits: GLAttribBits): number {
        let byteOffset: number = 0;
        if (GLAttribState.hasPostion(bits)) {
            byteOffset +=
                GLAttribState.POSITION_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasNormal(bits)) {
            byteOffset +=
                GLAttribState.NORMAL_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasTexcoord(bits)) {
            byteOffset +=
                GLAttribState.TEXCOORD_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasTexcoord1(bits)) {
            byteOffset +=
                GLAttribState.TEXCOORD1_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasColor(bits)) {
            byteOffset +=
                GLAttribState.COLOR_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if (GLAttribState.hasTangent(bits)) {
            byteOffset +=
                GLAttribState.TANGENT_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }

        return byteOffset;
    }

    public static setAttribVertexArrayPointer(
        gl: WebGLRenderingContext,
        offsetMap: GLAttribOffsetMap
    ): void {
        let stride: number = offsetMap[GLAttribState.ATTRIBSTRIDE];
        if (stride === 0) {
            throw new Error("vertex Array有问题");
        }
        if (
            stride === undefined ||
            stride !== offsetMap[GLAttribState.ATTRIBBYTELENGTH]
        ) {
            stride = 0;
        }

        let offset: number = offsetMap[GLAttribState.POSITION_NAME];
        if (offset !== undefined) {
            gl.vertexAttribPointer(
                GLAttribState.POSITION_LOCATION,
                GLAttribState.POSITION_COMPONENT,
                gl.FLOAT,
                false,
                stride,
                offset
            );
        }

        offset = offsetMap[GLAttribState.NORMAL_NAME];
        if (offset !== undefined) {
            gl.vertexAttribPointer(
                GLAttribState.NORMAL_LOCATION,
                GLAttribState.NORMAL_COMPONENT,
                gl.FLOAT,
                false,
                stride,
                offset
            );
        }

        offset = offsetMap[GLAttribState.TEXCOORD_NAME];
        if (offset !== undefined) {
            gl.vertexAttribPointer(
                GLAttribState.TEXCOORD_LOCATION,
                GLAttribState.TEXCOORD_COMPONENT,
                gl.FLOAT,
                false,
                stride,
                offset
            );
        }

        offset = offsetMap[GLAttribState.TEXCOORD1_NAME];
        if (offset !== undefined) {
            gl.vertexAttribPointer(
                GLAttribState.TEXCOORD1_LOCATION,
                GLAttribState.TEXCOORD1_COMPONENT,
                gl.FLOAT,
                false,
                stride,
                offset
            );
        }

        offset = offsetMap[GLAttribState.COLOR_NAME];
        if (offset !== undefined) {
            gl.vertexAttribPointer(
                GLAttribState.COLOR_LOCATION,
                GLAttribState.COLOR_COMPONENT,
                gl.FLOAT,
                false,
                stride,
                offset
            );
        }

        offset = offsetMap[GLAttribState.TANGENT_NAME];
        if (offset !== undefined) {
            gl.vertexAttribPointer(
                GLAttribState.TANGENT_LOCATION,
                GLAttribState.TANGENT_COMPONENT,
                gl.FLOAT,
                false,
                stride,
                offset
            );
        }
    }

    public static setAttribVertexArrayState(
        gl: WebGLRenderingContext,
        bits: number,
        enable: boolean = true
    ): void {
        if (GLAttribState.hasPostion(bits)) {
            if (enable) {
                gl.enableVertexAttribArray(GLAttribState.POSITION_LOCATION);
            } else {
                gl.disableVertexAttribArray(GLAttribState.POSITION_LOCATION);
            }
        }

        if (GLAttribState.hasNormal(bits)) {
            if (enable) {
                gl.enableVertexAttribArray(GLAttribState.NORMAL_LOCATION);
            } else {
                gl.disableVertexAttribArray(GLAttribState.NORMAL_LOCATION);
            }
        }

        if (GLAttribState.hasTexcoord(bits)) {
            if (enable) {
                gl.enableVertexAttribArray(GLAttribState.TEXCOORD_LOCATION);
            } else {
                gl.disableVertexAttribArray(GLAttribState.TEXCOORD_LOCATION);
            }
        }

        if (GLAttribState.hasTexcoord1(bits)) {
            if (enable) {
                gl.enableVertexAttribArray(GLAttribState.TEXCOORD1_LOCATION);
            } else {
                gl.disableVertexAttribArray(GLAttribState.TEXCOORD1_LOCATION);
            }
        }

        if (GLAttribState.hasColor(bits)) {
            if (enable) {
                gl.enableVertexAttribArray(GLAttribState.COLOR_LOCATION);
            } else {
                gl.disableVertexAttribArray(GLAttribState.COLOR_LOCATION);
            }
        }

        if (GLAttribState.hasTangent(bits)) {
            if (enable) {
                gl.enableVertexAttribArray(GLAttribState.TANGENT_LOCATION);
            } else {
                gl.disableVertexAttribArray(GLAttribState.TANGENT_LOCATION);
            }
        }
    }
}
