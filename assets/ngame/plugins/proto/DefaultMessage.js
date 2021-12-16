/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = protobuf;

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.DefaultResponse = (function() {

    /**
     * Properties of a DefaultResponse.
     * @exports IDefaultResponse
     * @interface IDefaultResponse
     * @property {string|null} [value] DefaultResponse value
     */

    /**
     * Constructs a new DefaultResponse.
     * @exports DefaultResponse
     * @classdesc Represents a DefaultResponse.
     * @implements IDefaultResponse
     * @constructor
     * @param {IDefaultResponse=} [properties] Properties to set
     */
    function DefaultResponse(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * DefaultResponse value.
     * @member {string} value
     * @memberof DefaultResponse
     * @instance
     */
    DefaultResponse.prototype.value = "";

    /**
     * Creates a new DefaultResponse instance using the specified properties.
     * @function create
     * @memberof DefaultResponse
     * @static
     * @param {IDefaultResponse=} [properties] Properties to set
     * @returns {DefaultResponse} DefaultResponse instance
     */
    DefaultResponse.create = function create(properties) {
        return new DefaultResponse(properties);
    };

    /**
     * Encodes the specified DefaultResponse message. Does not implicitly {@link DefaultResponse.verify|verify} messages.
     * @function encode
     * @memberof DefaultResponse
     * @static
     * @param {IDefaultResponse} message DefaultResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DefaultResponse.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.value != null && Object.hasOwnProperty.call(message, "value"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.value);
        return writer;
    };

    /**
     * Encodes the specified DefaultResponse message, length delimited. Does not implicitly {@link DefaultResponse.verify|verify} messages.
     * @function encodeDelimited
     * @memberof DefaultResponse
     * @static
     * @param {IDefaultResponse} message DefaultResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DefaultResponse.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a DefaultResponse message from the specified reader or buffer.
     * @function decode
     * @memberof DefaultResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {DefaultResponse} DefaultResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DefaultResponse.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.DefaultResponse();
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
     * Decodes a DefaultResponse message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof DefaultResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {DefaultResponse} DefaultResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DefaultResponse.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DefaultResponse message.
     * @function verify
     * @memberof DefaultResponse
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DefaultResponse.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.value != null && message.hasOwnProperty("value"))
            if (!$util.isString(message.value))
                return "value: string expected";
        return null;
    };

    /**
     * Creates a DefaultResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof DefaultResponse
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {DefaultResponse} DefaultResponse
     */
    DefaultResponse.fromObject = function fromObject(object) {
        if (object instanceof $root.DefaultResponse)
            return object;
        var message = new $root.DefaultResponse();
        if (object.value != null)
            message.value = String(object.value);
        return message;
    };

    /**
     * Creates a plain object from a DefaultResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof DefaultResponse
     * @static
     * @param {DefaultResponse} message DefaultResponse
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DefaultResponse.toObject = function toObject(message, options) {
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
     * Converts this DefaultResponse to JSON.
     * @function toJSON
     * @memberof DefaultResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DefaultResponse.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return DefaultResponse;
})();

module.exports = $root;
