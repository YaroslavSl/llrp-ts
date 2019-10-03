import parameterC from '../../src/parametersConstants';

describe('Check method for parameter constants declaration', () => {
    it('should return right parameter constants ', async () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        expect.assertions(4);

        const expectedResponse1: number = 226;
        const result1: number = parameterC.EventsAndReports;
        expect(result1).toEqual(expectedResponse1);

        const expectedResponse2: boolean = false;
        const result2: boolean = parameterC.hasSubParameters[parameterC.UTCTimeStamp];
        expect(result2).toEqual(expectedResponse2);

        const expectedResponse3: number = 12;
        const result3: number = parameterC.staticLengths[parameterC.UTCTimeStamp];
        expect(result3).toEqual(expectedResponse3);

        const expectedResponse4: string = 'UTCTimeStamp';
        const result4: string = parameterC[parameterC.UTCTimeStamp];
        expect(result4).toEqual(expectedResponse4);
    });
});
