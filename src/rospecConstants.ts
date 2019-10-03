type RospecConstant = {
    [key: string]: number;
};

const constants: RospecConstant = {
    // ROBoundarySpec TVL parameter
    ROSpecStartTriggerType: 0x00,
    ROSpecStopTriggerType: 0x00,
    DurationTriggerValue: 0,

    // AISpec TVL parameter
    AntennaCount: 1,
    AntennaId: 0,
    AISpecStopTriggerType: 0,
    AISpecStopDurationTriggerValue: 0,

    // InventoryParameterSpec TVL parameter in AISpec TVL parameter
    EPCGlobalClass1Gen2: 0x01,
    inventoryParameterSpecId: 123,

    // ROReportSpec parameter includes 2 parameters inside like a Matryoshka doll
    // |-ROReportSpec
    //   |--TagReportContentSelector
    //     |---C1G2EPCMemorySelector

    // Bits field in C1G2EPCMemorySelector parameter
    enableCRC: 0x80,
    enablePCbits: 0x40,
    enableXPCBits: 0x20,

    // Bits field in ROReportSpec TVL parameter
    enableROSpecID: 0x8000,
    enableSpecIndex: 0x4000,
    enableInventoryParameterSpecID: 0x2000,
    enableAntennaID: 0x1000,
    enableChannelIndex: 0x800,
    enablePeakRSSI: 0x400,
    enableFirstSeenTimestamp: 0x200,
    enableLastSeenTimestamp: 0x100,
    enableTagSeenCount: 0x80,
    enableAccessSpecID: 0x40,

    // ROReportSpec TVL parameter
    ROreportTrigger: 0x01,
    N: 1,

    // ROSpecIDParameters in ADD_ROSPEC message
    Priority: 0,
    CurrentState: 0,

    // Impinj rospec constants
    impinjVendorId: 0x651A, // 25882

    // antenna configuration constants for AntennaConfiguration parameter
    hopTableId: 1,
    channelIndex: 1,
    tari: 0,
    session: 0x40,
    tagTranzitTime: 0,
    tagInventoryStateAwareNo: 0,
    rfSensitivity: 1
};

export const rospecConstants: RospecConstant = Object.freeze(constants); // freeze prevents changes by users
