# llrp-ts
Tag reader for connecting with RFID reader through LLRP(LLRP UHF RFID Driver for node.js/TypeScript)

==========

llrp protocol implementation

Nodejs module to read RFID tags by connecting to a RFID reader through LLRP protocol.

## Version history

v.0.0.1 - version based on https://github.com/GeenenTijd/llrp-nodejs 

v.0.0.2 - Code refactoring. Add Impinj Specific message for  AddRoSpec. Add close connection public method. Add parsing for AntennaID, PeakRSSI, LastSeenTimestampUTC.

v.0.0.3 - Code refactoring. Add llrp message creator. Fixed bugs in endode.js. Add received EPC96 or EPC numbers. Add disableRFTransmitter and enableRFTransmitter methods.

v.0.0.4 - Converted code to TypeScript. Add unit tests.

v.0.0.5 - Add reading of TID number. 

v.0.0.6 - Add configuration for antennas number.  

v.0.0.7 - Add antenna power configuration.  

v.0.0.8 - Fix sending command when socket is closed.

v.0.0.9 - Add radio transmitter on/off commands and events.  

### Authors

Yaroslav Slipchuk

### Installation

```
yarn add llrp-ts
```

### Config

You can provide a config object with the following values:

ipaddress - IP of the RFID reader (default 192.168.0.30) 

port - port of the RFID reader (default 5084)

and radio operation configuration according to the llrp protocol https://www.gs1.org/standards/epc-rfid/llrp/1-1-0

### Methods

connect(),
disconnect(),
disableRFTransmitter(),
enableRFTransmitter()

### Example

```
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

```
