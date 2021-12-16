import * as $protobuf from "protobufjs";
/** Properties of a DefaultResponse. */
export interface IDefaultResponse {

    /** DefaultResponse value */
    value?: (string|null);
}

/** Represents a DefaultResponse. */
export class DefaultResponse implements IDefaultResponse {

    /**
     * Constructs a new DefaultResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDefaultResponse);

    /** DefaultResponse value. */
    public value: string;

    /**
     * Creates a new DefaultResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DefaultResponse instance
     */
    public static create(properties?: IDefaultResponse): DefaultResponse;

    /**
     * Encodes the specified DefaultResponse message. Does not implicitly {@link DefaultResponse.verify|verify} messages.
     * @param message DefaultResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDefaultResponse, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified DefaultResponse message, length delimited. Does not implicitly {@link DefaultResponse.verify|verify} messages.
     * @param message DefaultResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDefaultResponse, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DefaultResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DefaultResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DefaultResponse;

    /**
     * Decodes a DefaultResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DefaultResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): DefaultResponse;

    /**
     * Verifies a DefaultResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DefaultResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DefaultResponse
     */
    public static fromObject(object: { [k: string]: any }): DefaultResponse;

    /**
     * Creates a plain object from a DefaultResponse message. Also converts values to other types if specified.
     * @param message DefaultResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DefaultResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DefaultResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
