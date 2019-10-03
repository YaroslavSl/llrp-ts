import { GetLlrpMessage } from '../../src/getLlrpMessage';
import { RospecParameters } from '../../src/interfaces/llrp';

describe('Check message constructor', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should buffer of reset configuration command to factory settings', async () => {
        expect.assertions(1);

        const expectedResponse: Buffer = new Buffer('04030000000b000004b580', 'hex');

        const result: Buffer = GetLlrpMessage.resetConfigurationToFactoryDefaults();

        expect(result).toEqual(expectedResponse);
    });
    it('should return buffer of delete all rospecs command', async () => {
        expect.assertions(1);

        const expectedResponse: Buffer = new Buffer('04150000000e0000000000000000', 'hex');

        const result: Buffer = GetLlrpMessage.deleteAllROSpecs();

        expect(result).toEqual(expectedResponse);
    });

    it('should return buffer of setReaderConfig command', async () => {
        expect.assertions(1);

        const expectedResponse: Buffer = new Buffer('040300000010000000000000e2000580', 'hex');

        const result: Buffer = GetLlrpMessage.setReaderConfig();

        expect(result).toEqual(expectedResponse);
    });

    it('should return buffer of addRoSpec command', async () => {
        expect.assertions(1);

        const expectedResponse: Buffer = new Buffer('0414000000500000000400b1004600000001000000b2001200b300050000b60009000000000000b700180001000000b80009000000000000ba0007007B0100ed001201000100ee000bffc0015c0005c0', 'hex');
        const rospecParameters: RospecParameters = {
            enableReadingTid: false,
            channelIndex: 1,
            inventorySearchMode: 1,
            antennasConfig: []
        };
        const result: Buffer = GetLlrpMessage.addRoSpec(1, rospecParameters);

        expect(result).toEqual(expectedResponse);
    });

    it('should return buffer of addRoSpec command', async () => {
        expect.assertions(1);

        const expectedResponse: Buffer = new Buffer('04400000000a00000000', 'hex');

        const result: Buffer = GetLlrpMessage.enableEventsAndReport();

        expect(result).toEqual(expectedResponse);
    });

    it('should return buffer of addRoSpec command', async () => {
        expect.assertions(1);

        const expectedResponse: Buffer = new Buffer('04180000000e0000000000000001', 'hex');

        const result: Buffer = GetLlrpMessage.enableRoSpec(1);

        expect(result).toEqual(expectedResponse);
    });

    it('should return buffer of startRoSpec command', async () => {
        expect.assertions(1);

        const expectedResponse: Buffer = new Buffer('04160000000e0000000000000001', 'hex');

        const result: Buffer = GetLlrpMessage.startRoSpec(1);

        expect(result).toEqual(expectedResponse);
    });

    it('should return buffer of disableRoSpec command', async () => {
        expect.assertions(1);

        const expectedResponse: Buffer = new Buffer('04190000000e0000000000000001', 'hex');

        const result: Buffer = GetLlrpMessage.disableRoSpec(1);

        expect(result).toEqual(expectedResponse);
    });

    it('should return buffer of deleteRoSpec command', async () => {
        expect.assertions(1);

        const expectedResponse: Buffer = new Buffer('04150000000e0000000000000001', 'hex');

        const result: Buffer = GetLlrpMessage.deleteRoSpec(1);

        expect(result).toEqual(expectedResponse);
    });

    it('should return buffer of keepAliveAck command', async () => {
        expect.assertions(1);

        const expectedResponse: Buffer = new Buffer('04480000000a00000000', 'hex');

        const result: Buffer = GetLlrpMessage.keepAliveAck();

        expect(result).toEqual(expectedResponse);
    });

    it('should return buffer of closeConnection command', async () => {
        expect.assertions(1);

        const expectedResponse: Buffer = new Buffer('040e0000000a00000000', 'hex');

        const result: Buffer = GetLlrpMessage.closeConnection();

        expect(result).toEqual(expectedResponse);
    });

    it('should return buffer of Antenna configuration parameter', async () => {
        expect.assertions(1);

        const expectedResponse: Buffer = new Buffer('00DE003C000100DF0006000100e0000a000100010057014a002600014f0008000300000150000b4000200000000003ff000e0000651a000000170001', 'hex');

        const result: Buffer = GetLlrpMessage.getAntennaConfig(1, 87, 1, 1, 3, 32);

        expect(result).toEqual(expectedResponse);
    });
});
