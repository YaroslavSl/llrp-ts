"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
// reader tcp/ip config
const config = {
    ipaddress: '192.168.1.90',
    port: 5084,
    radioOperationConfig: {
        enableReadingTid: true,
        modeIndex: 3,
        tagPopulation: 4,
        channelIndex: 1,
        inventorySearchMode: 1,
        antennasConfig: [
            // NOTE:
            // if no object in array it is switch all antennas on
            //  { number: 0, power: 31.5 } - switch all antennas on with 31.5 dBm
            //  { number: 1, power: 10.0 } - switch the first antenna on with 10 dBm
            { number: 1, power: 31.5 },
        ]
    }
};
const reader = new index_1.LLRP(config, console);
reader.connect();
reader.on(index_1.RfidReaderEvent.Timeout, () => {
    console.log('timeout');
});
reader.on(index_1.RfidReaderEvent.Disconnect, (error) => {
    console.log('disconnect', error);
});
reader.on(index_1.RfidReaderEvent.Error, (error) => {
    console.log(`error: JSON.stringify(${error})`);
});
reader.on(index_1.RfidReaderEvent.DisabledRadioOperation, () => {
    console.log('disabledRadioOperation');
});
reader.on(index_1.RfidReaderEvent.StartedRadioOperation, () => {
    console.log('startedRadioOperation');
});
reader.on(index_1.RfidReaderEvent.LlrpError, (error) => {
    console.log('protocol error:', error);
});
reader.on(index_1.RfidReaderEvent.DidSeeTag, (tag) => {
    console.log(`Read: ${JSON.stringify(tag)}`);
    // if (tag.EPC96) console.log('EPC96: ' + JSON.stringify(tag.EPC96));
    // if (tag.EPCData) console.log('EPCData: ' + JSON.stringify(tag.EPCData));
    // if (tag.TID) console.log('TID: ' + JSON.stringify(tag.TID));
});
setInterval(() => {
    reader.disableRFTransmitter();
    console.log('RFID:disable rfid');
}, 10000);
setTimeout(() => setInterval(() => {
    reader.enableRFTransmitter();
    console.log('RFID:enable rfid');
}, 10000), 5000);
function normalExit() {
    reader.disconnect();
    setTimeout(() => { process.exit(0); }, 1000);
}
process.on('SIGINT', () => {
    console.log('SIGINT');
    normalExit();
});
process.on('SIGQUIT', () => {
    console.log('SIGQUIT');
    normalExit();
});
process.on('SIGTERM', () => {
    console.log('SIGTERM');
    normalExit();
});
// catches uncaught exceptions
process.on('uncaughtException', () => {
    console.log('uncaughtException');
    normalExit();
});
// catches unhandled promise rejection
process.on('unhandledRejection', () => {
    console.log('unhandledRejection');
    normalExit();
});
//# sourceMappingURL=example.js.map