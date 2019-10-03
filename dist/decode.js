"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parametersConstants_1 = require("./parametersConstants");
/**
 * Decodes a Buffer object to an object with key value
 * pairs that can be used to create a new LLRPMessage
 *
 * @param  {Buffer} buffer  A buffer object.
 * @return {Object}         A key value pair that can be used to create a new LLRPMessage.
 */
exports.decodeMessage = function (buffer, returnObject = []) {
    // if we have an empty Buffer object.
    if (buffer.length === 0) {
        // end the recursion.
        return undefined;
    }
    // set variables
    const length = buffer.readUInt32BE(2); // length would be read from the 3rd octet, 4 octets.
    // add to our returnObject our LLRPMessage key value pair.
    returnObject.push({
        length,
        type: ((buffer[0] & 3) << 8) | buffer[1],
        id: buffer.readUInt32BE(6),
        parameter: buffer.slice(10, length),
    });
    // check if there are still parameters following this parameter.
    // if none, undefined will be returned and will not reach the step
    // of getting added to the returnObject.
    exports.decodeMessage(buffer.slice(length), returnObject);
    return returnObject;
};
/**
 * Decodes a Buffer object to an object with key value
 * pairs that can be used to create a new LLRPParameter.
 *
 * @param  {Buffer} buffer         A buffer object.
 * @param  {Array} returnObject  An array containing objects for LLRPParameter, recursion.
 * @return {Array}               An array containing all the decoded objects.
 */
exports.decodeParameter = (buffer, returnObject = []) => {
    // if we have an empty Buffer object.
    if (buffer.length === 0) {
        return undefined;
    }
    // set variables.
    let type = null;
    let length = 0;
    let value = null;
    let subParameters = null;
    let reserved = 0;
    // if is TV-encoded (starts with first bit set as 1)
    if (buffer[0] & 128) {
        type = buffer[0] & 127; // type is the first 7 bits of the first octet.
        length = parametersConstants_1.default.tvLengths[type]; // each TV has a defined length, we reference in our parameter constant.
        // since it is not present in a TV encoded buffer.
        value = buffer.slice(1, length); // the value in a TV starts from the second octet up the entire length of the buffer.
        reserved = 1; // reserved is set as 1 on the first octet's most significant bit.
    }
    else {
        type = ((buffer[0] & 3) << 8) | buffer[1]; // type is the first 2 bits of the first octet and the second octet.
        length = buffer.readUInt16BE(2); // each TLV has length in the third and fourth octet.
        value = buffer.slice(4, length); // the value in a TLV starts from the fifth octet up the entire length of the buffer.
    }
    // see if our parameter constant lists this buffer as having subParameters
    if (parametersConstants_1.default.hasSubParameters[type]) {
        // check for subParameter via recursion.
        // undefined will be returned if none is found.
        subParameters = exports.decodeParameter(value.slice(parametersConstants_1.default.staticLengths[type] - (length - value.length)));
    }
    // add to our returnObject our LLRPParameter key value pair.
    returnObject.push({
        type,
        length,
        value,
        reserved,
        subParameters,
        typeName: parametersConstants_1.default[type],
    });
    // check if there are still parameters following this parameter.
    // if none, undefined will be returned and will not reach the step
    // of getting added to the returnObject.
    exports.decodeParameter(buffer.slice(length), returnObject);
    return returnObject;
};
//# sourceMappingURL=decode.js.map