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

export interface AntennaConfig {
    number: number;
    power: number; /** e.g.: 31.5 = 31.5 dBm, 1.0 = 1 dBm */
}

export interface RospecParameters {
    enableReadingTid?: boolean;
    antennasConfig?: AntennaConfig[];
    tagPopulation?: number;
    modeIndex?: number;
    channelIndex: number;
    inventorySearchMode: number; // 1 - Single target (impinj custom parameter)
}

export interface RadioOperationConfig extends RospecParameters {}

export interface ReaderConfig {
    ipaddress: string;
    port?: number;
    radioOperationConfig: RadioOperationConfig;
    isReaderConfigSet?: boolean;
    isStartROSpecSent?: boolean;
    isReaderConfigReset?: boolean;
}

export interface LlrpReader {
    connected: boolean;
    connect(): void;
    disconnect(): void;
    disableRFTransmitter(): void;
    enableRFTransmitter(): void;
}

export interface Logger {
    debug(...args: any[]): void;
}

export enum RfidReaderEvent {
    Timeout = 'timeout',
    Connected = 'connected',
    Disconnect = 'disconnect',
    Error = 'error',
    DisabledRadioOperation = 'disabledRadioOperation',
    StartedRadioOperation = 'startedRadioOperation',
    LlrpError = 'llrpError',
    DidSeeTag = 'didSeeTag',
}
