"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parametersConstants_1 = require("./parametersConstants");
class LLRPParameter {
    constructor(data) {
        this.type = {
            value: data.type,
            bits: 0
        };
        this.length = {
            value: data.length,
            bits: 0
        };
        this.reserved = {
            value: data.reserved,
            bits: 0
        };
        this.value = {
            value: data.value,
            bits: data.value.length * 8
        };
        this.subParameters = data.subParameters;
        // check if it is TV encoded.
        if (this.isTV(this.type.value)) {
            this.type.bits = 7; // type bits is 7.
            this.length.bits = 0; // length is not encoded.
            this.reserved.bits = 1; // reserved bits is 1.
        }
        else { // TLV encoded.
            this.type.bits = 10; // type bits is 10.
            this.length.bits = 16; // length bits is 16.
            this.reserved.bits = 6; // reserved bits is 6.
        }
    }
    /*--Set methods--
    -----------------------------------------------------------------------------*/
    /*setValue(value: number): void {
        this.value.value = value; // set type. bits will depend on encoding type.
        this.value.bits = value.length * 8;

        // check if it is TV encoded.
        if (isTV(this.type.value)) {
            this.length.value = 1 + this.value.length; // length is 1 octet of type + value octets.
        } else { // TLV encoded.
            this.length.value = 4 + this.value.length; // length is 2 octets reserved and type + 2 octets length + value octets
        }
    }*/
    setSubParameters(subParameters) {
        this.subParameters = subParameters;
    }
    /*--Get methods--
    -----------------------------------------------------------------------------*/
    getTypeName() {
        return parametersConstants_1.default[this.type.value];
    }
    getType() {
        return this.type.value;
    }
    getLength() {
        return this.length.value;
    }
    getValue() {
        return this.value.value;
    }
    getReserved() {
        return this.reserved.value;
    }
    getSubParameters() {
        return this.subParameters;
    }
    getEncoding() {
        if (this.isTV(this.type.value)) {
            return parametersConstants_1.default.ENCODING_TV;
        }
        return parametersConstants_1.default.ENCODING_TLV;
    }
    isTV(type) {
        // TV (type-value) is from 0-127
        return (type < 128);
    }
}
exports.LLRPParameter = LLRPParameter;
//# sourceMappingURL=parameters.js.map