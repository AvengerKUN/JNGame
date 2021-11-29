/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.cn = (function() {

    /**
     * Namespace cn.
     * @exports cn
     * @namespace
     */
    var cn = {};

    cn.jisol = (function() {

        /**
         * Namespace jisol.
         * @memberof cn
         * @namespace
         */
        var jisol = {};

        jisol.proto = (function() {

            /**
             * Namespace proto.
             * @memberof cn.jisol
             * @namespace
             */
            var proto = {};

            proto.message = (function() {

                /**
                 * Namespace message.
                 * @memberof cn.jisol.proto
                 * @namespace
                 */
                var message = {};

                message.ProtoTest = (function() {

                    /**
                     * Properties of a ProtoTest.
                     * @memberof cn.jisol.proto.message
                     * @interface IProtoTest
                     * @property {string|null} [message] ProtoTest message
                     */

                    /**
                     * Constructs a new ProtoTest.
                     * @memberof cn.jisol.proto.message
                     * @classdesc Represents a ProtoTest.
                     * @implements IProtoTest
                     * @constructor
                     * @param {cn.jisol.proto.message.IProtoTest=} [properties] Properties to set
                     */
                    function ProtoTest(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * ProtoTest message.
                     * @member {string} message
                     * @memberof cn.jisol.proto.message.ProtoTest
                     * @instance
                     */
                    ProtoTest.prototype.message = "";

                    /**
                     * Creates a new ProtoTest instance using the specified properties.
                     * @function create
                     * @memberof cn.jisol.proto.message.ProtoTest
                     * @static
                     * @param {cn.jisol.proto.message.IProtoTest=} [properties] Properties to set
                     * @returns {cn.jisol.proto.message.ProtoTest} ProtoTest instance
                     */
                    ProtoTest.create = function create(properties) {
                        return new ProtoTest(properties);
                    };

                    /**
                     * Encodes the specified ProtoTest message. Does not implicitly {@link cn.jisol.proto.message.ProtoTest.verify|verify} messages.
                     * @function encode
                     * @memberof cn.jisol.proto.message.ProtoTest
                     * @static
                     * @param {cn.jisol.proto.message.IProtoTest} message ProtoTest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    ProtoTest.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.message);
                        return writer;
                    };

                    /**
                     * Encodes the specified ProtoTest message, length delimited. Does not implicitly {@link cn.jisol.proto.message.ProtoTest.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof cn.jisol.proto.message.ProtoTest
                     * @static
                     * @param {cn.jisol.proto.message.IProtoTest} message ProtoTest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    ProtoTest.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a ProtoTest message from the specified reader or buffer.
                     * @function decode
                     * @memberof cn.jisol.proto.message.ProtoTest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {cn.jisol.proto.message.ProtoTest} ProtoTest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    ProtoTest.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cn.jisol.proto.message.ProtoTest();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.message = reader.string();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a ProtoTest message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof cn.jisol.proto.message.ProtoTest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {cn.jisol.proto.message.ProtoTest} ProtoTest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    ProtoTest.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a ProtoTest message.
                     * @function verify
                     * @memberof cn.jisol.proto.message.ProtoTest
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    ProtoTest.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.message != null && message.hasOwnProperty("message"))
                            if (!$util.isString(message.message))
                                return "message: string expected";
                        return null;
                    };

                    /**
                     * Creates a ProtoTest message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof cn.jisol.proto.message.ProtoTest
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {cn.jisol.proto.message.ProtoTest} ProtoTest
                     */
                    ProtoTest.fromObject = function fromObject(object) {
                        if (object instanceof $root.cn.jisol.proto.message.ProtoTest)
                            return object;
                        var message = new $root.cn.jisol.proto.message.ProtoTest();
                        if (object.message != null)
                            message.message = String(object.message);
                        return message;
                    };

                    /**
                     * Creates a plain object from a ProtoTest message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof cn.jisol.proto.message.ProtoTest
                     * @static
                     * @param {cn.jisol.proto.message.ProtoTest} message ProtoTest
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    ProtoTest.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults)
                            object.message = "";
                        if (message.message != null && message.hasOwnProperty("message"))
                            object.message = message.message;
                        return object;
                    };

                    /**
                     * Converts this ProtoTest to JSON.
                     * @function toJSON
                     * @memberof cn.jisol.proto.message.ProtoTest
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    ProtoTest.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return ProtoTest;
                })();

                return message;
            })();

            return proto;
        })();

        return jisol;
    })();

    return cn;
})();

module.exports = $root;
