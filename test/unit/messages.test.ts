import { LLRPMessage } from '../../src/messages';
import { Message, LlrpMessage as ILlrpMessage  } from '../../src/interfaces/messages';

describe('Check LLRPMessage class', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
   it('should return right message properties ', async () => {
        expect.assertions(3);

        const message: Message = <Message>{};
        message.type = 2;
        message.length = 0;

        // LLRPMessage: {"id":{"value":3,"bits":32},"reserved":{"value":0,"bits":3},"version":{"value":2,"bits":3},"type":{"value":2,"bits":10},"parameter":{"value":{"type":"Buffer","data":[]},"bits":0},"length":{"value":10,"bits":32}} 
        const messageStruct:ILlrpMessage = new LLRPMessage(message);
        messageStruct.setVersion(2);
        messageStruct.setID(3);

        const expectedResponse1: number = 2;
        const result1: number = messageStruct.getVersion();
        expect(result1).toEqual(expectedResponse1);

        const expectedResponse2: string = 'GET_READER_CONFIG';
        const result2: string = messageStruct.getTypeName();
        expect(result2).toEqual(expectedResponse2);

        const expectedResponse3: number = 0;
        const result3: number = messageStruct.getParameter().length;
        expect(result3).toEqual(expectedResponse3);
    });
});
