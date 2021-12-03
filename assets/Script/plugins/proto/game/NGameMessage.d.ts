import * as $protobuf from "protobufjs";
/** Properties of a NGameMessage. */
export interface INGameMessage {

    /** NGameMessage action */
    action?: (string|null);

    /** NGameMessage event */
    event?: (string|null);

    /** NGameMessage uid */
    uid?: (number|null);

    /** NGameMessage message */
    message?: (google.protobuf.IAny|null);
}

/** Represents a NGameMessage. */
export class NGameMessage implements INGameMessage {

    /**
     * Constructs a new NGameMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: INGameMessage);

    /** NGameMessage action. */
    public action: string;

    /** NGameMessage event. */
    public event: string;

    /** NGameMessage uid. */
    public uid: number;

    /** NGameMessage message. */
    public message?: (google.protobuf.IAny|null);

    /**
     * Creates a new NGameMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns NGameMessage instance
     */
    public static create(properties?: INGameMessage): NGameMessage;

    /**
     * Encodes the specified NGameMessage message. Does not implicitly {@link NGameMessage.verify|verify} messages.
     * @param message NGameMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: INGameMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified NGameMessage message, length delimited. Does not implicitly {@link NGameMessage.verify|verify} messages.
     * @param message NGameMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: INGameMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a NGameMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns NGameMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): NGameMessage;

    /**
     * Decodes a NGameMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns NGameMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): NGameMessage;

    /**
     * Verifies a NGameMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a NGameMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns NGameMessage
     */
    public static fromObject(object: { [k: string]: any }): NGameMessage;

    /**
     * Creates a plain object from a NGameMessage message. Also converts values to other types if specified.
     * @param message NGameMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: NGameMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this NGameMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of an Any. */
        interface IAny {

            /** Any type_url */
            type_url?: (string|null);

            /** Any value */
            value?: (Uint8Array|null);
        }

        /** Represents an Any. */
        class Any implements IAny {

            /**
             * Constructs a new Any.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IAny);

            /** Any type_url. */
            public type_url: string;

            /** Any value. */
            public value: Uint8Array;

            /**
             * Creates a new Any instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Any instance
             */
            public static create(properties?: google.protobuf.IAny): google.protobuf.Any;

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Any;

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Any;

            /**
             * Verifies an Any message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Any
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Any;

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @param message Any
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Any, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Any to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
