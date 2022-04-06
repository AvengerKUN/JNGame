/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.NStateVec3 = (function() {

    /**
     * Properties of a NStateVec3.
     * @exports INStateVec3
     * @interface INStateVec3
     * @property {number|null} [x] NStateVec3 x
     * @property {number|null} [y] NStateVec3 y
     * @property {number|null} [z] NStateVec3 z
     */

    /**
     * Constructs a new NStateVec3.
     * @exports NStateVec3
     * @classdesc Represents a NStateVec3.
     * @implements INStateVec3
     * @constructor
     * @param {INStateVec3=} [properties] Properties to set
     */
    function NStateVec3(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * NStateVec3 x.
     * @member {number} x
     * @memberof NStateVec3
     * @instance
     */
    NStateVec3.prototype.x = 0;

    /**
     * NStateVec3 y.
     * @member {number} y
     * @memberof NStateVec3
     * @instance
     */
    NStateVec3.prototype.y = 0;

    /**
     * NStateVec3 z.
     * @member {number} z
     * @memberof NStateVec3
     * @instance
     */
    NStateVec3.prototype.z = 0;

    /**
     * Creates a new NStateVec3 instance using the specified properties.
     * @function create
     * @memberof NStateVec3
     * @static
     * @param {INStateVec3=} [properties] Properties to set
     * @returns {NStateVec3} NStateVec3 instance
     */
    NStateVec3.create = function create(properties) {
        return new NStateVec3(properties);
    };

    /**
     * Encodes the specified NStateVec3 message. Does not implicitly {@link NStateVec3.verify|verify} messages.
     * @function encode
     * @memberof NStateVec3
     * @static
     * @param {INStateVec3} message NStateVec3 message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NStateVec3.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.x != null && Object.hasOwnProperty.call(message, "x"))
            writer.uint32(/* id 1, wireType 1 =*/9).double(message.x);
        if (message.y != null && Object.hasOwnProperty.call(message, "y"))
            writer.uint32(/* id 2, wireType 1 =*/17).double(message.y);
        if (message.z != null && Object.hasOwnProperty.call(message, "z"))
            writer.uint32(/* id 3, wireType 1 =*/25).double(message.z);
        return writer;
    };

    /**
     * Encodes the specified NStateVec3 message, length delimited. Does not implicitly {@link NStateVec3.verify|verify} messages.
     * @function encodeDelimited
     * @memberof NStateVec3
     * @static
     * @param {INStateVec3} message NStateVec3 message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NStateVec3.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a NStateVec3 message from the specified reader or buffer.
     * @function decode
     * @memberof NStateVec3
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {NStateVec3} NStateVec3
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NStateVec3.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NStateVec3();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.x = reader.double();
                break;
            case 2:
                message.y = reader.double();
                break;
            case 3:
                message.z = reader.double();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a NStateVec3 message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof NStateVec3
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {NStateVec3} NStateVec3
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NStateVec3.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a NStateVec3 message.
     * @function verify
     * @memberof NStateVec3
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    NStateVec3.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.x != null && message.hasOwnProperty("x"))
            if (typeof message.x !== "number")
                return "x: number expected";
        if (message.y != null && message.hasOwnProperty("y"))
            if (typeof message.y !== "number")
                return "y: number expected";
        if (message.z != null && message.hasOwnProperty("z"))
            if (typeof message.z !== "number")
                return "z: number expected";
        return null;
    };

    /**
     * Creates a NStateVec3 message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof NStateVec3
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {NStateVec3} NStateVec3
     */
    NStateVec3.fromObject = function fromObject(object) {
        if (object instanceof $root.NStateVec3)
            return object;
        var message = new $root.NStateVec3();
        if (object.x != null)
            message.x = Number(object.x);
        if (object.y != null)
            message.y = Number(object.y);
        if (object.z != null)
            message.z = Number(object.z);
        return message;
    };

    /**
     * Creates a plain object from a NStateVec3 message. Also converts values to other types if specified.
     * @function toObject
     * @memberof NStateVec3
     * @static
     * @param {NStateVec3} message NStateVec3
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    NStateVec3.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.x = 0;
            object.y = 0;
            object.z = 0;
        }
        if (message.x != null && message.hasOwnProperty("x"))
            object.x = options.json && !isFinite(message.x) ? String(message.x) : message.x;
        if (message.y != null && message.hasOwnProperty("y"))
            object.y = options.json && !isFinite(message.y) ? String(message.y) : message.y;
        if (message.z != null && message.hasOwnProperty("z"))
            object.z = options.json && !isFinite(message.z) ? String(message.z) : message.z;
        return object;
    };

    /**
     * Converts this NStateVec3 to JSON.
     * @function toJSON
     * @memberof NStateVec3
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    NStateVec3.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return NStateVec3;
})();

$root.NStateMessage = (function() {

    /**
     * Properties of a NStateMessage.
     * @exports INStateMessage
     * @interface INStateMessage
     * @property {number|Long|null} [nId] NStateMessage nId
     * @property {number|Long|null} [prefab] NStateMessage prefab
     * @property {Object.<string,google.protobuf.IAny>|null} [states] NStateMessage states
     */

    /**
     * Constructs a new NStateMessage.
     * @exports NStateMessage
     * @classdesc Represents a NStateMessage.
     * @implements INStateMessage
     * @constructor
     * @param {INStateMessage=} [properties] Properties to set
     */
    function NStateMessage(properties) {
        this.states = {};
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * NStateMessage nId.
     * @member {number|Long} nId
     * @memberof NStateMessage
     * @instance
     */
    NStateMessage.prototype.nId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * NStateMessage prefab.
     * @member {number|Long} prefab
     * @memberof NStateMessage
     * @instance
     */
    NStateMessage.prototype.prefab = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * NStateMessage states.
     * @member {Object.<string,google.protobuf.IAny>} states
     * @memberof NStateMessage
     * @instance
     */
    NStateMessage.prototype.states = $util.emptyObject;

    /**
     * Creates a new NStateMessage instance using the specified properties.
     * @function create
     * @memberof NStateMessage
     * @static
     * @param {INStateMessage=} [properties] Properties to set
     * @returns {NStateMessage} NStateMessage instance
     */
    NStateMessage.create = function create(properties) {
        return new NStateMessage(properties);
    };

    /**
     * Encodes the specified NStateMessage message. Does not implicitly {@link NStateMessage.verify|verify} messages.
     * @function encode
     * @memberof NStateMessage
     * @static
     * @param {INStateMessage} message NStateMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NStateMessage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.nId != null && Object.hasOwnProperty.call(message, "nId"))
            writer.uint32(/* id 1, wireType 0 =*/8).int64(message.nId);
        if (message.prefab != null && Object.hasOwnProperty.call(message, "prefab"))
            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.prefab);
        if (message.states != null && Object.hasOwnProperty.call(message, "states"))
            for (var keys = Object.keys(message.states), i = 0; i < keys.length; ++i) {
                writer.uint32(/* id 3, wireType 2 =*/26).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                $root.google.protobuf.Any.encode(message.states[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
            }
        return writer;
    };

    /**
     * Encodes the specified NStateMessage message, length delimited. Does not implicitly {@link NStateMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof NStateMessage
     * @static
     * @param {INStateMessage} message NStateMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NStateMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a NStateMessage message from the specified reader or buffer.
     * @function decode
     * @memberof NStateMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {NStateMessage} NStateMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NStateMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NStateMessage(), key, value;
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.nId = reader.int64();
                break;
            case 2:
                message.prefab = reader.int64();
                break;
            case 3:
                if (message.states === $util.emptyObject)
                    message.states = {};
                var end2 = reader.uint32() + reader.pos;
                key = "";
                value = null;
                while (reader.pos < end2) {
                    var tag2 = reader.uint32();
                    switch (tag2 >>> 3) {
                    case 1:
                        key = reader.string();
                        break;
                    case 2:
                        value = $root.google.protobuf.Any.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag2 & 7);
                        break;
                    }
                }
                message.states[key] = value;
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a NStateMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof NStateMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {NStateMessage} NStateMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NStateMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a NStateMessage message.
     * @function verify
     * @memberof NStateMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    NStateMessage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.nId != null && message.hasOwnProperty("nId"))
            if (!$util.isInteger(message.nId) && !(message.nId && $util.isInteger(message.nId.low) && $util.isInteger(message.nId.high)))
                return "nId: integer|Long expected";
        if (message.prefab != null && message.hasOwnProperty("prefab"))
            if (!$util.isInteger(message.prefab) && !(message.prefab && $util.isInteger(message.prefab.low) && $util.isInteger(message.prefab.high)))
                return "prefab: integer|Long expected";
        if (message.states != null && message.hasOwnProperty("states")) {
            if (!$util.isObject(message.states))
                return "states: object expected";
            var key = Object.keys(message.states);
            for (var i = 0; i < key.length; ++i) {
                var error = $root.google.protobuf.Any.verify(message.states[key[i]]);
                if (error)
                    return "states." + error;
            }
        }
        return null;
    };

    /**
     * Creates a NStateMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof NStateMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {NStateMessage} NStateMessage
     */
    NStateMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.NStateMessage)
            return object;
        var message = new $root.NStateMessage();
        if (object.nId != null)
            if ($util.Long)
                (message.nId = $util.Long.fromValue(object.nId)).unsigned = false;
            else if (typeof object.nId === "string")
                message.nId = parseInt(object.nId, 10);
            else if (typeof object.nId === "number")
                message.nId = object.nId;
            else if (typeof object.nId === "object")
                message.nId = new $util.LongBits(object.nId.low >>> 0, object.nId.high >>> 0).toNumber();
        if (object.prefab != null)
            if ($util.Long)
                (message.prefab = $util.Long.fromValue(object.prefab)).unsigned = false;
            else if (typeof object.prefab === "string")
                message.prefab = parseInt(object.prefab, 10);
            else if (typeof object.prefab === "number")
                message.prefab = object.prefab;
            else if (typeof object.prefab === "object")
                message.prefab = new $util.LongBits(object.prefab.low >>> 0, object.prefab.high >>> 0).toNumber();
        if (object.states) {
            if (typeof object.states !== "object")
                throw TypeError(".NStateMessage.states: object expected");
            message.states = {};
            for (var keys = Object.keys(object.states), i = 0; i < keys.length; ++i) {
                if (typeof object.states[keys[i]] !== "object")
                    throw TypeError(".NStateMessage.states: object expected");
                message.states[keys[i]] = $root.google.protobuf.Any.fromObject(object.states[keys[i]]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a NStateMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof NStateMessage
     * @static
     * @param {NStateMessage} message NStateMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    NStateMessage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.objects || options.defaults)
            object.states = {};
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.nId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.nId = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.prefab = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.prefab = options.longs === String ? "0" : 0;
        }
        if (message.nId != null && message.hasOwnProperty("nId"))
            if (typeof message.nId === "number")
                object.nId = options.longs === String ? String(message.nId) : message.nId;
            else
                object.nId = options.longs === String ? $util.Long.prototype.toString.call(message.nId) : options.longs === Number ? new $util.LongBits(message.nId.low >>> 0, message.nId.high >>> 0).toNumber() : message.nId;
        if (message.prefab != null && message.hasOwnProperty("prefab"))
            if (typeof message.prefab === "number")
                object.prefab = options.longs === String ? String(message.prefab) : message.prefab;
            else
                object.prefab = options.longs === String ? $util.Long.prototype.toString.call(message.prefab) : options.longs === Number ? new $util.LongBits(message.prefab.low >>> 0, message.prefab.high >>> 0).toNumber() : message.prefab;
        var keys2;
        if (message.states && (keys2 = Object.keys(message.states)).length) {
            object.states = {};
            for (var j = 0; j < keys2.length; ++j)
                object.states[keys2[j]] = $root.google.protobuf.Any.toObject(message.states[keys2[j]], options);
        }
        return object;
    };

    /**
     * Converts this NStateMessage to JSON.
     * @function toJSON
     * @memberof NStateMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    NStateMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return NStateMessage;
})();

$root.NStateMessages = (function() {

    /**
     * Properties of a NStateMessages.
     * @exports INStateMessages
     * @interface INStateMessages
     * @property {Array.<INStateMessage>|null} [messages] NStateMessages messages
     */

    /**
     * Constructs a new NStateMessages.
     * @exports NStateMessages
     * @classdesc Represents a NStateMessages.
     * @implements INStateMessages
     * @constructor
     * @param {INStateMessages=} [properties] Properties to set
     */
    function NStateMessages(properties) {
        this.messages = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * NStateMessages messages.
     * @member {Array.<INStateMessage>} messages
     * @memberof NStateMessages
     * @instance
     */
    NStateMessages.prototype.messages = $util.emptyArray;

    /**
     * Creates a new NStateMessages instance using the specified properties.
     * @function create
     * @memberof NStateMessages
     * @static
     * @param {INStateMessages=} [properties] Properties to set
     * @returns {NStateMessages} NStateMessages instance
     */
    NStateMessages.create = function create(properties) {
        return new NStateMessages(properties);
    };

    /**
     * Encodes the specified NStateMessages message. Does not implicitly {@link NStateMessages.verify|verify} messages.
     * @function encode
     * @memberof NStateMessages
     * @static
     * @param {INStateMessages} message NStateMessages message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NStateMessages.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.messages != null && message.messages.length)
            for (var i = 0; i < message.messages.length; ++i)
                $root.NStateMessage.encode(message.messages[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified NStateMessages message, length delimited. Does not implicitly {@link NStateMessages.verify|verify} messages.
     * @function encodeDelimited
     * @memberof NStateMessages
     * @static
     * @param {INStateMessages} message NStateMessages message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NStateMessages.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a NStateMessages message from the specified reader or buffer.
     * @function decode
     * @memberof NStateMessages
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {NStateMessages} NStateMessages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NStateMessages.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NStateMessages();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.messages && message.messages.length))
                    message.messages = [];
                message.messages.push($root.NStateMessage.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a NStateMessages message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof NStateMessages
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {NStateMessages} NStateMessages
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NStateMessages.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a NStateMessages message.
     * @function verify
     * @memberof NStateMessages
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    NStateMessages.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.messages != null && message.hasOwnProperty("messages")) {
            if (!Array.isArray(message.messages))
                return "messages: array expected";
            for (var i = 0; i < message.messages.length; ++i) {
                var error = $root.NStateMessage.verify(message.messages[i]);
                if (error)
                    return "messages." + error;
            }
        }
        return null;
    };

    /**
     * Creates a NStateMessages message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof NStateMessages
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {NStateMessages} NStateMessages
     */
    NStateMessages.fromObject = function fromObject(object) {
        if (object instanceof $root.NStateMessages)
            return object;
        var message = new $root.NStateMessages();
        if (object.messages) {
            if (!Array.isArray(object.messages))
                throw TypeError(".NStateMessages.messages: array expected");
            message.messages = [];
            for (var i = 0; i < object.messages.length; ++i) {
                if (typeof object.messages[i] !== "object")
                    throw TypeError(".NStateMessages.messages: object expected");
                message.messages[i] = $root.NStateMessage.fromObject(object.messages[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a NStateMessages message. Also converts values to other types if specified.
     * @function toObject
     * @memberof NStateMessages
     * @static
     * @param {NStateMessages} message NStateMessages
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    NStateMessages.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.messages = [];
        if (message.messages && message.messages.length) {
            object.messages = [];
            for (var j = 0; j < message.messages.length; ++j)
                object.messages[j] = $root.NStateMessage.toObject(message.messages[j], options);
        }
        return object;
    };

    /**
     * Converts this NStateMessages to JSON.
     * @function toJSON
     * @memberof NStateMessages
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    NStateMessages.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return NStateMessages;
})();

$root.google = (function() {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    var google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        var protobuf = {};

        protobuf.Any = (function() {

            /**
             * Properties of an Any.
             * @memberof google.protobuf
             * @interface IAny
             * @property {string|null} [type_url] Any type_url
             * @property {Uint8Array|null} [value] Any value
             */

            /**
             * Constructs a new Any.
             * @memberof google.protobuf
             * @classdesc Represents an Any.
             * @implements IAny
             * @constructor
             * @param {google.protobuf.IAny=} [properties] Properties to set
             */
            function Any(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Any type_url.
             * @member {string} type_url
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.type_url = "";

            /**
             * Any value.
             * @member {Uint8Array} value
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.value = $util.newBuffer([]);

            /**
             * Creates a new Any instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny=} [properties] Properties to set
             * @returns {google.protobuf.Any} Any instance
             */
            Any.create = function create(properties) {
                return new Any(properties);
            };

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type_url != null && Object.hasOwnProperty.call(message, "type_url"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.type_url);
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
                return writer;
            };

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Any();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.type_url = reader.string();
                        break;
                    case 2:
                        message.value = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Any message.
             * @function verify
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Any.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    if (!$util.isString(message.type_url))
                        return "type_url: string expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                        return "value: buffer expected";
                return null;
            };

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Any} Any
             */
            Any.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Any)
                    return object;
                var message = new $root.google.protobuf.Any();
                if (object.type_url != null)
                    message.type_url = String(object.type_url);
                if (object.value != null)
                    if (typeof object.value === "string")
                        $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                    else if (object.value.length)
                        message.value = object.value;
                return message;
            };

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.Any} message Any
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Any.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.type_url = "";
                    if (options.bytes === String)
                        object.value = "";
                    else {
                        object.value = [];
                        if (options.bytes !== Array)
                            object.value = $util.newBuffer(object.value);
                    }
                }
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    object.type_url = message.type_url;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
                return object;
            };

            /**
             * Converts this Any to JSON.
             * @function toJSON
             * @memberof google.protobuf.Any
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Any.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Any;
        })();

        return protobuf;
    })();

    return google;
})();

module.exports = $root;
