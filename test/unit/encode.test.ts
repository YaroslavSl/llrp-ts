import { encodeMessage, encodeParameter } from '../../src/encode';
import parameterC from '../../src/parametersConstants';
import { LLRPParameter } from '../../src/parameters';
import { LLRPMessage } from '../../src/messages';

import { LlrpMessage, Message } from '../../src/interfaces/messages';
import { Parameter } from '../../src/interfaces/parameters';
import { MessagesType } from '../../src/interfaces/messagesType';

describe('Encode library', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Check encode method for parameter and message', () => {
        it('should return buffer with ROSpec parameter', async () => {
            expect.assertions(1);

            const parameter: Parameter = <Parameter>{};
            parameter.type = parameterC.ROSpec;
            parameter.value = new Buffer(1);
            parameter.length = parameter.value.length + 4;
            parameter.reserved = 0;

            const expectedResponse: Buffer = new Buffer('00b1000500', 'hex');

            const result: Buffer = encodeParameter(new LLRPParameter(parameter));

            expect(result).toEqual(expectedResponse);
        });
        it('should return buffer with SET_READER_CONFIG message', async () => {
            expect.assertions(1);

            const message: Message = <Message>{};
            message.type   = MessagesType.SET_READER_CONFIG;
            message.length = 0;
            message.parameter = new Buffer('00b1000500', 'hex');
            const messageStruct:LlrpMessage = new LLRPMessage(message);
            messageStruct.setVersion(1);
            messageStruct.setID(2);

            const expectedResponse: Buffer = new Buffer('04030000000f0000000200b1000500', 'hex');

            const result: Buffer = encodeMessage(messageStruct);

            expect(result).toEqual(expectedResponse);
        });
    });
});
