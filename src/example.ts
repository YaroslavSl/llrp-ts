import { LLRP, RfidReaderEvent } from './index';

import { ReaderConfig, TagInformation } from './interfaces/llrp';

// reader tcp/ip config
const config: ReaderConfig = {
    ipaddress: '192.168.1.90',
    port : 5084,
    radioOperationConfig: {
        enableReadingTid: true,
        modeIndex: 3,
        tagPopulation: 4,
        channelIndex: 1,
        inventorySearchMode: 1, // 1 - Single target (impinj custom parameter)
        antennasConfig: [
        // NOTE:
        // if no object in array it is switch all antennas on
        //  { number: 0, power: 31.5 } - switch all antennas on with 31.5 dBm
        //  { number: 1, power: 10.0 } - switch the first antenna on with 10 dBm
            { number: 1, power: 31.5 },
            // { number: 2, power: 31.5 },
            // { number: 3, power: 31.5 },
            // { number: 4, power: 31.5 }
        ]
    }
};

const reader: LLRP = new LLRP(config, console);

reader.connect();

reader.on(RfidReaderEvent.Timeout, () => {
    console.log('timeout');
});

reader.on(RfidReaderEvent.Disconnect, (error: Error) => {
    console.log('disconnect', error);
});

reader.on(RfidReaderEvent.Error, (error: any) => {
    console.log(`error: JSON.stringify(${ error })`);
});

reader.on(RfidReaderEvent.DisabledRadioOperation, () => {
    console.log('disabledRadioOperation');
});

reader.on(RfidReaderEvent.StartedRadioOperation, () => {
    console.log('startedRadioOperation');
});

reader.on(RfidReaderEvent.LlrpError, (error: Error) => {
    console.log('protocol error:', error);
});

reader.on(RfidReaderEvent.DidSeeTag, (tag: TagInformation) => {
    console.log(`Read: ${ JSON.stringify(tag) }`);
    // if (tag.EPC96) console.log('EPC96: ' + JSON.stringify(tag.EPC96));
    // if (tag.EPCData) console.log('EPCData: ' + JSON.stringify(tag.EPCData));
    // if (tag.TID) console.log('TID: ' + JSON.stringify(tag.TID));
});

setInterval(
    () => {
        reader.disableRFTransmitter();
        console.log('RFID:disable rfid');
    },
    10000
);

setTimeout(
    () => setInterval(
        () => {
            reader.enableRFTransmitter();
            console.log('RFID:enable rfid');
        },
        10000
    ),
    5000
);

function normalExit(): void {
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
