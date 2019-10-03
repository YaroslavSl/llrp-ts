import { EventEmitter }  from 'events';

import { LlrpReader } from './src/index';

import { ReaderConfig, AntennaConfig, Logger } from './src/interfaces/llrp';

declare module 'llrp-gm' {
    export class LLRP extends EventEmitter implements LlrpReader {
        connected: boolean;
        constructor(config: ReaderConfig, logger?: Logger);
        connect(): void;
        disconnect(): void;
        disableRFTransmitter(): void;
        enableRFTransmitter(): void;
    }

    export interface TagInformation {
        TID?: string;
        EPC96?: string;
        EPCData?: string;
        antennaID?: number;
        tagSeenCount?: number;
        peakRSSI?: number;
        specIndex?: number;
        inventoryParameterSpecID?: number;
        channelIndex?: number;
        C1G2PC?: number;
        C1G2CRC?: number;
        accessSpecID?: number;
        roSpecID?: number;
        firstSeenTimestampUTC?: number; // useconds
        lastSeenTimestampUTC?: number; // useconds
        custom?: string;
    }

    export interface RadioOperationConfig {
        enableReadingTid?: boolean;
        antennasConfig?: AntennaConfig[];
        tagPopulation?: number;
        modeIndex?: number;
    }

    export enum RfidReaderEvent {
        Timeout = 'timeout',
        Connected = 'connected',
        Disconnect = 'disconnect',
        Error = 'error',
        DisabledRadioOperation = 'disabledRadioOperation',
        StartedRadioOperation = 'startedRadioOperation',
        LlrpError = 'llrpError',
        DidSeeTag = 'didSeeTag'
    }
}
