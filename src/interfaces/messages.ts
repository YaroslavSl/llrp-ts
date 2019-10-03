import { MessagesType } from './messagesType';

export interface Message {
    type: MessagesType;
    length: number;
    id?: number;
    reserved?: number;
    parameter?: Buffer;
    version?: number;
}

export interface LlrpFieldType {
    value: number;
    bits: number;
}

export interface MessageParameter {
    value: Buffer;
    bits: number;
}

export interface LlrpMessage {
    parameter: MessageParameter;

    setType(type: number): void;
    setVersion(version: number): void;
    setID(id: number): void;
    setParameter(parameter: Buffer): void;
    getId(): number;
    getReserved(): number;
    getLength(): number;
    getVersion(): number;
    getType(): number;
    getTypeName(): string;
    getParameter(): Buffer;
}
