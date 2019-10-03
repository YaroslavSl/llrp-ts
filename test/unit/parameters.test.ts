import { LLRPParameter } from '../../src/parameters';
import { Parameter } from '../../src/interfaces/parameters';

describe('Check method for parameter class', () => {
    it('should return right parameter properties ', async () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        expect.assertions(3);

        const parameter: Parameter = <Parameter>{};
        parameter.type = 2;
        parameter.value = Buffer.allocUnsafe(1);
        parameter.value.writeUInt8(0xAA, 0);
        parameter.length = parameter.value.length + 4;
        parameter.reserved = 0;

        const llrpTestParameter: LLRPParameter = new LLRPParameter(parameter);

        expect(llrpTestParameter.getType()).toEqual(2);
        expect(llrpTestParameter.getLength()).toEqual(5);

        const test: Buffer = Buffer.allocUnsafe(1);
       test.writeUInt8(0xAA, 0);
        expect(llrpTestParameter.value.value.compare(test)).toEqual(0);
    });
});
