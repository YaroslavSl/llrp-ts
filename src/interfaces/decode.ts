export interface ObjectMessageElement {
    type: number;      // type is the first 2 bits of the first octet and the second octet.
    length: number;    // total length of message in octets.
    id: number;        // id would be read from the 7th octet, 4 octets.
    parameter: Buffer; // the parameter value would be starting from 11 up to the end of the curernt message.
}

export interface ObjectParameterElement {
    typeName: string;
    type: number;
    length: number;
    value: Buffer;
    reserved: number;
    subParameters: ObjectParameterElement;
}
