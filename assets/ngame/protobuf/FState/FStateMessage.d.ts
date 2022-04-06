import * as $protobuf from "protobufjs";
/** Properties of a NStateVec3. */
export interface INStateVec3 {

    /** NStateVec3 x */
    x?: (number|null);

    /** NStateVec3 y */
    y?: (number|null);

    /** NStateVec3 z */
    z?: (number|null);
}

/** Represents a NStateVec3. */
export class NStateVec3 implements INStateVec3 {

    /**
     * Constructs a new NStateVec3.
     * @param [properties] Properties to set
     */
    constructor(properties?: INStateVec3);

    /** NStateVec3 x. */
    public x: number;

    /** NStateVec3 y. */
    public y: number;

    /** NStateVec3 z. */
    public z: number;

    /**
     * Creates a new NStateVec3 instance using the specified properties.
     * @param [properties] Properties to set
     * @returns NStateVec3 instance
     */
    public static create(properties?: INStateVec3): NStateVec3;

    /**
     * Encodes the specified NStateVec3 message. Does not implicitly {@link NStateVec3.verify|verify} messages.
     * @param message NStateVec3 message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: INStateVec3, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified NStateVec3 message, length delimited. Does not implicitly {@link NStateVec3.verify|verify} messages.
     * @param message NStateVec3 message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: INStateVec3, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a NStateVec3 message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns NStateVec3
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): NStateVec3;

    /**
     * Decodes a NStateVec3 message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns NStateVec3
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): NStateVec3;

    /**
     * Verifies a NStateVec3 message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a NStateVec3 message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns NStateVec3
     */
    public static fromObject(object: { [k: string]: any }): NStateVec3;

    /**
     * Creates a plain object from a NStateVec3 message. Also converts values to other types if specified.
     * @param message NStateVec3
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: NStateVec3, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this NStateVec3 to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a NStateMessage. */
export interface INStateMessage {

    /** NStateMessage nId */
    nId?: (number|Long|null);

    /** NStateMessage prefab */
    prefab?: (number|Long|null);

    /** NStateMessage states */
    states?: ({ [k: string]: google.protobuf.IAny }|null);
}

/** Represents a NStateMessage. */
export class NStateMessage implements INStateMessage {

    /**
     * Constructs a new NStateMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: INStateMessage);

    /** NStateMessage nId. */
    public nId: (number|Long);

    /** NStateMessage prefab. */
    public prefab: (number|Long);

    /** NStateMessage states. */
    public states: { [k: string]: google.protobuf.IAny };

    /**
     * Creates a new NStateMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns NStateMessage instance
     */
    public static create(properties?: INStateMessage): NStateMessage;

    /**
     * Encodes the specified NStateMessage message. Does not implicitly {@link NStateMessage.verify|verify} messages.
     * @param message NStateMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: INStateMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified NStateMessage message, length delimited. Does not implicitly {@link NStateMessage.verify|verify} messages.
     * @param message NStateMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: INStateMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a NStateMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns NStateMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): NStateMessage;

    /**
     * Decodes a NStateMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns NStateMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): NStateMessage;

    /**
     * Verifies a NStateMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a NStateMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns NStateMessage
     */
    public static fromObject(object: { [k: string]: any }): NStateMessage;

    /**
     * Creates a plain object from a NStateMessage message. Also converts values to other types if specified.
     * @param message NStateMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: NStateMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this NStateMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a NStateMessages. */
export interface INStateMessages {

    /** NStateMessages messages */
    messages?: (INStateMessage[]|null);
}

/** Represents a NStateMessages. */
export class NStateMessages implements INStateMessages {

    /**
     * Constructs a new NStateMessages.
     * @param [properties] Properties to set
     */
    constructor(properties?: INStateMessages);

    /** NStateMessages messages. */
    public messages: INStateMessage[];

    /**
     * Creates a new NStateMessages instance using the specified properties.
     * @param [properties] Properties to set
     * @returns NStateMessages instance
     */
    public static create(properties?: INStateMessages): NStateMessages;

    /**
     * Encodes the specified NStateMessages message. Does not implicitly {@link NStateMessages.verify|verify} messages.
     * @param message NStateMessages message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: INStateMessages, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified NStateMessages message, length delimited. Does not implicitly {@link NStateMessages.verify|verify} messages.
     * @param message NStateMessages message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: INStateMessages, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a NStateMessages message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns NStateMessages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): NStateMessages;

    /**
     * Decodes a NStateMessages message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns NStateMessages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): NStateMessages;

    /**
     * Verifies a NStateMessages message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a NStateMessages message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns NStateMessages
     */
    public static fromObject(object: { [k: string]: any }): NStateMessages;

    /**
     * Creates a plain object from a NStateMessages message. Also converts values to other types if specified.
     * @param message NStateMessages
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: NStateMessages, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this NStateMessages to JSON.
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
