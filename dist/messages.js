"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messagesType_1 = require("./interfaces/messagesType");
class LLRPMessage {
    constructor(data) {
        this.version = {
            value: 1,
            bits: 3
        };
        this.id = {
            value: 0,
            bits: 32
        };
        this.reserved = {
            value: 0,
            bits: 3
        };
        this.getVersion = () => this.version.value;
        this.getType = () => this.type.value;
        this.getId = () => this.id.value;
        this.getLength = () => this.length.value;
        this.getReserved = () => this.reserved.value;
        this.getTypeName = () => messagesType_1.MessagesType[this.type.value];
        this.getParameter = () => this.parameter.value;
        this.setType(data.type);
        if (typeof data.id !== 'undefined') {
            this.id.value = data.id & 4294967295;
        }
        if (typeof data.reserved !== 'undefined') {
            this.reserved.value = data.reserved;
        }
        if (typeof data.parameter !== 'undefined') {
            this.setParameter(data.parameter);
        }
        else {
            this.setParameter(new Buffer(0));
        }
        if (typeof data.version !== 'undefined') {
            this.version.value = data.version;
        }
        this.length = {
            value: (this.reserved.bits + this.version.bits + // 04
                this.type.bits + this.parameter.bits + this.id.bits + 32) / 8,
            bits: 32
        };
    }
    setVersion(version) {
        this.version = {
            value: version & 7,
            bits: 3
        };
    }
    setType(type) {
        this.type = {
            value: type & 1023,
            bits: 10
        };
    }
    setID(id) {
        this.id = {
            value: id,
            bits: 32
        };
    }
    setParameter(parameter) {
        this.parameter = {
            value: parameter,
            bits: parameter.length * 8
        };
        this.length = {
            value: (this.reserved.bits + this.version.bits +
                this.type.bits + this.parameter.bits + this.id.bits + 32) / 8,
            bits: 32
        };
    }
}
exports.LLRPMessage = LLRPMessage;
//# sourceMappingURL=messages.js.map