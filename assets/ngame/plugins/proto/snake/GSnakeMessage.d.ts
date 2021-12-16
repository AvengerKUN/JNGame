import * as $protobuf from "protobufjs";
/** Properties of a GSnakeHelloMessage. */
export interface IGSnakeHelloMessage {

    /** GSnakeHelloMessage value */
    value?: (string|null);
}

/** Represents a GSnakeHelloMessage. */
export class GSnakeHelloMessage implements IGSnakeHelloMessage {

    /**
     * Constructs a new GSnakeHelloMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGSnakeHelloMessage);

    /** GSnakeHelloMessage value. */
    public value: string;

    /**
     * Creates a new GSnakeHelloMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GSnakeHelloMessage instance
     */
    public static create(properties?: IGSnakeHelloMessage): GSnakeHelloMessage;

    /**
     * Encodes the specified GSnakeHelloMessage message. Does not implicitly {@link GSnakeHelloMessage.verify|verify} messages.
     * @param message GSnakeHelloMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IGSnakeHelloMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified GSnakeHelloMessage message, length delimited. Does not implicitly {@link GSnakeHelloMessage.verify|verify} messages.
     * @param message GSnakeHelloMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IGSnakeHelloMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GSnakeHelloMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GSnakeHelloMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GSnakeHelloMessage;

    /**
     * Decodes a GSnakeHelloMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GSnakeHelloMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GSnakeHelloMessage;

    /**
     * Verifies a GSnakeHelloMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a GSnakeHelloMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GSnakeHelloMessage
     */
    public static fromObject(object: { [k: string]: any }): GSnakeHelloMessage;

    /**
     * Creates a plain object from a GSnakeHelloMessage message. Also converts values to other types if specified.
     * @param message GSnakeHelloMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: GSnakeHelloMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this GSnakeHelloMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
