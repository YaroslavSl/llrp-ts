import { MessagesType } from './interfaces/messagesType';
import { Message, LlrpMessage, LlrpFieldType } from './interfaces/messages';

export class LLRPMessage implements LlrpMessage {
    public parameter: {
        value: Buffer;
        bits: number;
    };
    private version: LlrpFieldType = {
        value: 1, // set default version 1.
        bits: 3
    };
    private type: LlrpFieldType;
    private id: LlrpFieldType = {
        value: 0,
        bits: 32
    };
    private reserved: LlrpFieldType = {
        value: 0,
        bits: 3
    };
    private length: LlrpFieldType;

    constructor(data: Message) {
        this.setType(data.type);

        if (typeof data.id !== 'undefined') {
            this.id.value = data.id & 4294967295;
        }

        if (typeof data.reserved !== 'undefined') {
            this.reserved.value = data.reserved;
        }

        if (typeof data.parameter !== 'undefined') {
            this.setParameter(data.parameter);
        } else {
            this.setParameter(new Buffer(0));
        }

        if (typeof data.version !== 'undefined') {
            this.version.value = data.version;
        }

        this.length = {
            value: (this.reserved.bits + this.version.bits + // 04
                this.type.bits + this.parameter.bits + this.id.bits + 32) / 8, /* length field */
            bits: 32
        };
    }

    setVersion(version: number): void {
        this.version = {
            value: version & 7,
            bits: 3
        };
    }

    setType(type: number): void {
        this.type = {
            value: type & 1023,
            bits: 10
        };
    }

    setID(id: number): void {
        this.id = {
            value: id,
            bits: 32
        };
    }

    setParameter(parameter: Buffer): void {
        this.parameter = {
            value: parameter,
            bits: parameter.length * 8
        };
        this.length = {
            value: (this.reserved.bits + this.version.bits +
                this.type.bits + this.parameter.bits + this.id.bits + 32) / 8, /*length field*/
            bits: 32
        };
    }

    getVersion = (): number => this.version.value;

    getType = (): number => this.type.value;

    getId = (): number => this.id.value;

    getLength = (): number => this.length.value;

    getReserved = (): number => this.reserved.value;

    getTypeName = (): string => MessagesType[this.type.value];

    getParameter = (): Buffer => this.parameter.value;
}
