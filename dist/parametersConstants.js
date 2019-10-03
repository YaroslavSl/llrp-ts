"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exportsObject = {
    tvLengths: {},
    staticLengths: {},
    hasSubParameters: {}
};
/**
 * Sets an LLRPParameter constant.
 *
 * @param  {String}  name             the parameter name.
 * @param  {Int}     value            the parameter type number.
 * @param  {Object}  exportsObject    the object that will contain the "constants"
 * @param  {Boolean} hasSubParameter  does the parameter possibly contain
 * @param  {Int}     tvLength         how long in bytes the entire TV encoded parameter is.
 * @param  {Int}     staticLength     how long in bytes is the encoded parameter up to the last value, excluding sub-parameters and variable length values.
 */
const define = function (name, value, hasSubParameter, tvLength, staticLength) {
    // is tvLength set and greater than 0.
    if (tvLength && tvLength > 0) {
        // set tvLengths, use parameter type number (value) as the key.
        // defining our constant.
        Object.defineProperty(exportsObject.tvLengths, value, {
            value: tvLength,
            enumerable: true,
            writable: false,
        });
    }
    // is staticLength set and greater than 0.
    if (staticLength && staticLength > 0) {
        // set tvLengths, use parameter type number (value) as the key.
        // defining our constant.
        Object.defineProperty(exportsObject.staticLengths, value, {
            value: staticLength,
            enumerable: true,
            writable: false,
        });
    }
    // set defaults.
    exportsObject.hasSubParameters[value] = false;
    // is hasSubParameter set.
    if (hasSubParameter) {
        // set hasSubParameters, use parameter type number (value) as the key.
        // defining our constant.
        Object.defineProperty(exportsObject.hasSubParameters, value, {
            value: hasSubParameter,
            enumerable: true,
            writable: false,
        });
    }
    // defining our constant.
    Object.defineProperty(exportsObject, name, {
        value,
        enumerable: true,
        writable: false,
    });
    // defining our constant, reversed with key as value and value as key.
    Object.defineProperty(exportsObject, value, {
        value: name,
        enumerable: false,
        writable: false,
    });
};
/*--Constants--
-----------------------------------------------------------------------------*/
// General Parameters
define('UTCTimeStamp', 128, false, 0, 12);
define('Uptime', 129, false, 0, 12);
// Reader Device Capabilities Parameters
define('GeneralDeviceCapabilities', 137, true, 0, 18);
define('ReceiveSensitivityTableEntry', 139, false, 0, 8);
define('PerAntennaAirProtocol', 140, false, 0, 12);
define('GPIOCapabilities', 141, false, 0, 8);
define('LLRPCapabilities', 142, false, 0, 32);
define('RegulatoryCapabilities', 143, true, 0, 8);
define('UHFBandCapabilities', 144, true, 0, 4);
define('TransmitPowerLevelTableEntry', 145, false, 0, 8);
define('FrequencyInformation', 146, true, 0, 5);
define('FrequencyHopTable', 147, false, 0, 8); // Variable number of frequencies 1-n
define('FixedFrequencyTable', 148, false, 0, 6); // Variable number of frequencies 1-n
define('PerAntennaReceiveSensitivityRange', 149, false, 0, 10);
// Reader Operations Parameters
define('ROSpec', 177, true, 0, 10);
define('ROBoundarySpec', 178, true, 0, 4);
define('ROSpecStartTrigger', 179, true, 0, 5);
define('PeriodicTriggerValue', 180, true, 0, 12);
define('GPITriggerValue', 181, false, 0, 11);
define('ROSpecStopTrigger', 182, true, 0, 9);
define('AISpec', 183, true, 0, 6);
define('AISpecStopTrigger', 184, true, 0, 9);
define('TagObservationTrigger', 185, false, 0, 16);
define('InventoryParameterSpec', 186, true, 0, 7);
define('RFSurveySpec', 187, true, 0, 14);
define('RFSurveySpecStopTrigger', 188, false, 0, 13);
// Access Operation Parameters
define('AccessSpec', 207, true, 0, 16);
define('AccessSpecStopTrigger', 208, false, 0, 8);
define('AccessCommand', 209, true, 0, 4);
define('ClientRequestOpSpec', 210, false, 0, 6);
define('ClientRequestResponse', 211, true, 0, 8);
// Configuration Parameters
define('LLRPConfigurationStateValue', 217, false, 0, 8);
define('Identification', 218, false, 0, 7); // variable length ReaderID
define('GPOWriteData', 219, false, 0, 8);
define('KeepaliveSpec', 220, false, 0, 9);
define('AntennaProperties', 221, false, 0, 9);
define('AntennaConfiguration', 222, true, 0, 6);
define('RFReceiver', 223, false, 0, 6);
define('RFTransmitter', 224, false, 0, 10);
define('GPIPortCurrentState', 225, false, 0, 8);
define('EventsAndReports', 226, false, 0, 5);
// Reporting Parameters
define('ROReportSpec', 237, true, 0, 7);
define('TagReportContentSelector', 238, true, 0, 6);
define('AccessReportSpec', 239, false, 0, 6);
define('TagReportData', 240, true, 0, 4);
define('EPCData', 241, false, 0, 6); // variable length EPC
define('EPC96', 13, false, 13, 13);
define('ROSpecID', 9, false, 5, 5);
define('SpecIndex', 14, false, 3, 3);
define('InventoryParameterSpecID', 10, false, 3, 3);
define('AntennaID', 1, false, 3, 3);
define('PeakRSSI', 6, false, 2, 2);
define('ChannelIndex', 7, false, 3, 3);
define('FirstSeenTimestampUTC', 2, false, 9, 9);
define('FirstSeenTimestampUptime', 3, false, 9, 9);
define('LastSeenTimestampUTC', 4, false, 9, 9);
define('LastSeenTimestampUptime', 5, false, 9, 9);
define('TagSeenCount', 8, false, 3, 3);
define('ClientRequestOpSpecResult', 15, false, 3, 3);
define('AccessSpecID', 16, false, 5, 5);
define('RFSurveyReportData', 242, true, 0, 4);
define('FrequencyRSSILevelEntry', 243, true, 0, 14);
define('ReaderEventNotificationSpec', 244, true, 0, 4);
define('EventNotificationState', 245, false, 0, 7);
define('ReaderEventNotificationData', 246, true, 0, 4);
define('HoppingEvent', 247, false, 0, 8);
define('GPIEvent', 248, false, 0, 7);
define('ROSpecEvent', 249, false, 0, 13); // PreemptingROSpecID is ignored if EventType != 2
define('ReportBufferLevelWarningEvent', 250, false, 0, 5);
define('ReportBufferOverflowErrorEvent', 251, false, 0, 4);
define('ReaderExceptionEvent', 252, true, 0, 6); // variable length UTF8 Message
define('OpSpecID', 17, false, 3, 3);
define('RFSurveyEvent', 253, false, 0, 11);
define('AISpecEvent', 254, true, 0, 11);
define('AntennaEvent', 255, false, 0, 7);
define('ConnectionAttemptEvent', 256, false, 0, 6);
define('ConnectionCloseEvent', 257, false, 0, 4);
// LLRP Error Parameters
define('LLRPStatus', 287, false, 0, 8); // variable length UTF8 ErrorDescription
define('FieldError', 288, false, 0, 8);
define('ParameterError', 289, true, 0, 8);
define('Custom', 1023, false, 0, 12); // VendorParameter Vendor specific value
// Air Protocol Specific Parameters
// Class-1 Generation-2 (C1G2) Protocol Parameters
// Capabilities Parameters
define('C1G2LLRPCapabilities', 327, false, 0, 7);
define('UHFC1G2RFModeTable', 328, true, 0, 4);
define('UHFC1G2RFModeTableEntry', 329, false, 0, 32);
// Reader Operations Parameters
define('C1G2InventoryCommand', 330, true, 0, 5);
define('C1G2Filter', 331, true, 0, 5);
define('C1G2TagInventoryMask', 332, false, 0, 9); // Variable length bit count TagMask
define('C1G2TagInventoryStateAwareFilterAction', 333, false, 0, 6);
define('C1G2TagInventoryStateUnawareFilterAction', 334, false, 0, 5);
define('C1G2RFControl', 335, false, 0, 8);
define('C1G2SingulationControl', 336, true, 0, 11);
define('C1G2TagInventoryStateAwareSingulationAction', 337, false, 0, 5);
// Access Operation Parameters
define('C1G2TagSpec', 338, true, 0, 4);
define('C1G2TargetTag', 339, false, 0, 9); // Variable length bit count TagMask, plus 16 bit DataBitCount and ariable length bit count TagData
// C1G2 OpSpecs
define('C1G2Read', 341, false, 0, 15);
define('C1G2Write', 342, false, 0, 15); // Variable length word count WriteData
define('C1G2Kill', 343, false, 0, 10);
define('C1G2Lock', 344, true, 0, 10);
define('C1G2LockPayload', 345, false, 0, 6);
define('C1G2BlockErase', 346, false, 0, 15);
define('C1G2BlockWrite', 347, false, 0, 15); // Variable length word count WriteData
// Reporting Parameters
define('C1G2EPCMemorySelector', 348, false, 0, 5);
define('C1G2PC', 12, false, 3, 3);
define('C1G2CRC', 11, false, 3, 3);
define('C1G2SingulationDetails', 18, false, 5, 5);
// C1G2 OpSpec Results
define('C1G2ReadOpSpecResult', 349, false, 0, 9); // Variable word count ReadData
define('C1G2WriteOpSpecResult', 350, false, 0, 9);
define('C1G2KillOpSpecResult', 351, false, 0, 7);
define('C1G2LockOpSpecResult', 352, false, 0, 7);
define('C1G2BlockEraseOpSpecResult', 353, false, 0, 7);
define('C1G2BlockWriteOpSpecResult', 354, false, 0, 9);
// extra constants outside the form of our define function.
// defining ENCODING_TV.
Object.defineProperty(exportsObject, 'ENCODING_TV', {
    value: 1,
    enumerable: false,
    writable: false,
});
// defining ENCODING_TLV.
Object.defineProperty(exportsObject, 'ENCODING_TLV', {
    value: 2,
    enumerable: false,
    writable: false,
});
exports.default = exportsObject;
//# sourceMappingURL=parametersConstants.js.map