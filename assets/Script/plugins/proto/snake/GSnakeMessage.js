/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = protobuf;

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.GSnakeHelloMessage = (function() {

    /**
     * Properties of a GSnakeHelloMessage.
     * @exports IGSnakeHelloMessage
     * @interface IGSnakeHelloMessage
     * @property {string|null} [value] GSnakeHelloMessage value
     */

    /**
     * Constructs a new GSnakeHelloMessage.
     * @exports GSnakeHelloMessage
     * @classdesc Represents a GSnakeHelloMessage.
     * @implements IGSnakeHelloMessage
     * @constructor
     * @param {IGSnakeHelloMessage=} [properties] Properties to set
     */
    function GSnakeHelloMessage(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GSnakeHelloMessage value.
     * @member {string} value
     * @memberof GSnakeHelloMessage
     * @instance
     */
    GSnakeHelloMessage.prototype.value = "";

    /**
     * Creates a new GSnakeHelloMessage instance using the specified properties.
     * @function create
     * @memberof GSnakeHelloMessage
     * @static
     * @param {IGSnakeHelloMessage=} [properties] Properties to set
     * @returns {GSnakeHelloMessage} GSnakeHelloMessage instance
     */
    GSnakeHelloMessage.create = function create(properties) {
        return new GSnakeHelloMessage(properties);
    };

    /**
     * Encodes the specified GSnakeHelloMessage message. Does not implicitly {@link GSnakeHelloMessage.verify|verify} messages.
     * @function encode
     * @memberof GSnakeHelloMessage
     * @static
     * @param {IGSnakeHelloMessage} message GSnakeHelloMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GSnakeHelloMessage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.value != null && Object.hasOwnProperty.call(message, "value"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.value);
        return writer;
    };

    /**
     * Encodes the specified GSnakeHelloMessage message, length delimited. Does not implicitly {@link GSnakeHelloMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GSnakeHelloMessage
     * @static
     * @param {IGSnakeHelloMessage} message GSnakeHelloMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GSnakeHelloMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GSnakeHelloMessage message from the specified reader or buffer.
     * @function decode
     * @memberof GSnakeHelloMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GSnakeHelloMessage} GSnakeHelloMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GSnakeHelloMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GSnakeHelloMessage();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.value = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GSnakeHelloMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GSnakeHelloMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GSnakeHelloMessage} GSnakeHelloMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GSnakeHelloMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GSnakeHelloMessage message.
     * @function verify
     * @memberof GSnakeHelloMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GSnakeHelloMessage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.value != null && message.hasOwnProperty("value"))
            if (!$util.isString(message.value))
                return "value: string expected";
        return null;
    };

    /**
     * Creates a GSnakeHelloMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GSnakeHelloMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GSnakeHelloMessage} GSnakeHelloMessage
     */
    GSnakeHelloMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.GSnakeHelloMessage)
            return object;
        var message = new $root.GSnakeHelloMessage();
        if (object.value != null)
            message.value = String(object.value);
        return message;
    };

    /**
     * Creates a plain object from a GSnakeHelloMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GSnakeHelloMessage
     * @static
     * @param {GSnakeHelloMessage} message GSnakeHelloMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GSnakeHelloMessage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.value = "";
        if (message.value != null && message.hasOwnProperty("value"))
            object.value = message.value;
        return object;
    };

    /**
     * Converts this GSnakeHelloMessage to JSON.
     * @function toJSON
     * @memberof GSnakeHelloMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GSnakeHelloMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GSnakeHelloMessage;
})();

module.exports = $root;
