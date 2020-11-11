export class GLSttribState {
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

    public static readonly FLOAT32_SIZE = Float32Array.BYTES_PER_ELEMENT;
    public static readonly UINT16_SIZE = Uint16Array.BYTES_PER_ELEMENT;

    public static makeVertexAttribs(
        useTexcoord0: boolean,
        useTexcoord1: boolean,
        useNormal: boolean,
        useTangent: boolean,
        useColor: boolean
    ): number {
        let bits: number = GLSttribState.POSITION_BIT;
        if (useTexcoord0) bits |= GLSttribState.TEXCOORD_BIT;
        if (useTexcoord1) bits |= GLSttribState.TEXCOORD1_BIT;
        if (useNormal) bits |= GLSttribState.NORMAL_BIT;
        if (useTangent) bits |= GLSttribState.TANGENT_BIT;
        if (useColor) bits |= GLSttribState.COLOR_BIT;
        return bits;
    }

    public static hasPostion(bits: number): boolean {
        return (bits & GLSttribState.POSITION_BIT) !== 0;
    }
    public static hasNormal(bits: number): boolean {
        return (bits & GLSttribState.NORMAL_BIT) !== 0;
    }
    public static hasTangent(bits: number): boolean {
        return (bits & GLSttribState.TANGENT_BIT) !== 0;
    }
    public static hasColor(bits: number): boolean {
        return (bits & GLSttribState.COLOR_BIT) !== 0;
    }
    public static hasTexcoord(bits: number): boolean {
        return (bits & GLSttribState.TEXCOORD_BIT) !== 0;
    }
    public static hasTexcoord1(bits: number): boolean {
        return (bits & GLSttribState.TEXCOORD1_BIT) !== 0;
    }
}
