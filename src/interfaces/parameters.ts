import { MessageParameter } from './messages';

export interface Parameter {
    type: number;
    value: Buffer;
    length: number;
    reserved: number;
    subParameters?: Buffer;
}

export interface LlrpFieldType {
    value: number;
    bits: number;
}

export interface LlrpParameter {
    value: MessageParameter;
    subParameters: Buffer;

    setSubParameters(subParameters: Buffer): void;
    getTypeName(): string;
    getType(): number;
    getLength(): number;
    getValue(): Buffer;
    getReserved(): number;
    getSubParameters(): Buffer;
    getEncoding(): number;
}

export enum CustomParameterSubType {
    IMPINJ_SERIALIZED_TID = 55
}
