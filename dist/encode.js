"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Encodes to a writable buffer the LLRPMessage object.
 *
 * @param  {LLRPMessage} llrpMessage  object to encode to a buffer.
 * @return {Buffer}             writable buffer object
 */
exports.encodeMessage = function (llrpMessage) {
    // Create the buffer, should be the length of the message.
    // We will not account for slicing the data.
    const buffer = new Buffer(llrpMessage.getLength());
    // 3 bits of reserved value + 3 bits of version + 10 bits of Message Type | 32 bits of  Message Length | 32 bits of Message ID |
    buffer.writeUInt8((llrpMessage.getReserved() << 5) |
        (llrpMessage.getVersion() << 2) |
        ((llrpMessage.getType() >> 8) & 3), 0);
    buffer.writeUInt8(llrpMessage.getType() & 255, 1); // 10 bits from type value.
    buffer.writeUInt32BE(llrpMessage.getLength(), 2); // 32 bits from length.
    buffer.writeUInt32BE(llrpMessage.getId(), 6); // 32 bits from id.
    if (llrpMessage.parameter.value.length !== 0)
        llrpMessage.parameter.value.copy(buffer, 10); // copy the parameter.
    return buffer;
};
/**
 * Encodes to a writable buffer the LLRPParameter object.
 * This does not recurse the subParameters as encoded
 * subParameters are included in value.
 *
 * @param  {LLRPParameter} llrpParameter object to encode to a buffer.
 * @return {Buffer}        writable buffer object.
 */
exports.encodeParameter = function (llrpParameter) {
    // Create the buffer, should be the length of the llrpParameter.
    // We will not account for slicing the data.
    const buffer = new Buffer(llrpParameter.getLength());
    // If llrpParameter uses TV encoding
    if (llrpParameter.getType() < 128) {
        // write the first octet, where the most significant bit of the octet is 1.
        // buffer.writeUInt8(llrpParameter.reserved.value << 7 | llrpParameter.type.value, 0);
        // set the value of the parameter.
        llrpParameter.value.value.copy(buffer, 0);
    }
    else { // otherwise it uses TLV encoding
        // 6 bits of reserved value + 2 bits of type value
        buffer.writeUInt8((llrpParameter.getReserved() << 2) | ((llrpParameter.getType() & 768) >> 8), 0);
        // remaining 8 bits of type, writeUInt8 will take care of discarding excess bits.
        // no need for & 255.
        buffer.writeUInt8((llrpParameter.getType() & 0xFF), 1);
        // 16 bits from length, writeUInt16 will take care of discarding excess bits.
        // no need for & 65535.
        buffer.writeUInt16BE(llrpParameter.getLength(), 2);
        // copy the value.
        llrpParameter.value.value.copy(buffer, 4);
    }
    return buffer;
};
//# sourceMappingURL=encode.js.map