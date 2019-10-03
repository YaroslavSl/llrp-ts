"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Low Level Reader Protocol  (LLRP) standard https://www.gs1.org/sites/default/files/docs/epc/llrp_1_1-standard-20101013.pdf
 * LLRP Messages and Reader Actions are descibed at page 42 of the standard.
 *
 * TODO: Ask GET_READER_CAPABILITIES and proccess GET_READER_CAPABILITIES_RESPONSE
 */
const net = require("net");
const events_1 = require("events");
const Int64 = require("node-int64");
const parametersConstants_1 = require("./parametersConstants");
const messages_1 = require("./messages");
const decode_1 = require("./decode");
const getLlrpMessage_1 = require("./getLlrpMessage");
const llrp_1 = require("./interfaces/llrp");
const messagesType_1 = require("./interfaces/messagesType");
const parameters_1 = require("./interfaces/parameters");
__export(require("./interfaces/llrp"));
const defaultRoSpecId = 1;
class LLRP extends events_1.EventEmitter {
    constructor(config, logger) {
        super();
        this.logger = logger;
        this.port = 5084;
        this.isReaderConfigSet = false;
        this.isStartROSpecSent = false;
        this.isReaderConfigReset = false;
        this.allReaderRospecDeleted = false;
        this.allReaderAccessSpecDeleted = false;
        this.isExtensionsEnabled = false;
        this.sendEnableRospecOnceMore = true;
        this.radioOperationConfig = {};
        this.enableTransmitter = true;
        this.socket = new net.Socket();
        this.client = null;
        this.connected = false;
        // TODO: make a default config with a default value and then merge DB config with default
        this.ipaddress = config.ipaddress;
        this.port = config.port || this.port;
        this.radioOperationConfig = config.radioOperationConfig;
        this.radioOperationConfig.antennasConfig = config.radioOperationConfig.antennasConfig || [];
        this.radioOperationConfig.enableReadingTid = config.radioOperationConfig.enableReadingTid || false;
        this.isReaderConfigSet = config.isReaderConfigSet || this.isReaderConfigSet;
        this.isStartROSpecSent = config.isStartROSpecSent || this.isStartROSpecSent;
        this.isReaderConfigReset = config.isReaderConfigReset || this.isReaderConfigReset;
    }
    connect() {
        this.connected = true;
        this.enableTransmitter = true;
        // timeout after 60 seconds.
        this.socket.setTimeout(60000, () => {
            if (this.connected) {
                this.log('Connection timeout');
                process.nextTick(() => {
                    this.connected = false;
                    this.emit(llrp_1.RfidReaderEvent.Timeout, new Error('Connection timeout'));
                });
            }
        });
        // connect with reader
        this.client = this.socket.connect(this.port, this.ipaddress, () => {
            this.log(`Connected to ${this.ipaddress}:${this.port}`);
            process.nextTick(() => {
                this.emit(llrp_1.RfidReaderEvent.Connected);
            });
        });
        // whenever reader sends data.
        this.client.on('data', (data) => {
            this.handleReceivedData(data);
        });
        // // the reader or client has ended the connection.
        this.client.on('end', () => {
            // the session has ended
            this.log('client disconnected');
            process.nextTick(() => {
                this.connected = false;
                this.emit(llrp_1.RfidReaderEvent.Disconnect, new Error('Client disconnected.'));
            });
        });
        // cannot connect to the reader other than a timeout.
        this.client.on('error', (err) => {
            // error on the connection
            this.log(err);
            process.nextTick(() => {
                this.connected = false;
                this.emit(llrp_1.RfidReaderEvent.Error, err);
            });
        });
    }
    disconnect() {
        if (this.socket.destroyed) {
            return false;
        }
        this.connected = false;
        this.sendMessage(this.client, getLlrpMessage_1.GetLlrpMessage.deleteRoSpec(defaultRoSpecId));
        this.resetIsStartROSpecSent();
        return true;
    }
    disableRFTransmitter() {
        if (this.socket.destroyed) {
            return false;
        }
        this.enableTransmitter = false;
        this.sendMessage(this.client, getLlrpMessage_1.GetLlrpMessage.disableRoSpec(defaultRoSpecId));
        this.resetIsStartROSpecSent();
        return true;
    }
    enableRFTransmitter() {
        if (this.socket.destroyed) {
            return false;
        }
        this.enableTransmitter = true;
        this.sendEnableRospec(true);
        return true;
    }
    log(...args) {
        if (this.logger) {
            this.logger.debug('LLRP:', ...args);
        }
    }
    handleReceivedData(data) {
        process.nextTick(() => {
            // check if there is data.
            if (!data) {
                this.log('Undefined data returned by the rfid reader.');
            }
            // decoded message(s), passable to LLRPMessage class.
            const messagesKeyValue = decode_1.decodeMessage(data);
            // loop through the message.
            for (const index in messagesKeyValue) {
                // possible we have more than 1 message in a reply.
                const message = new messages_1.LLRPMessage(messagesKeyValue[index]);
                this.log(`Receiving: ${message.getTypeName()}`);
                this.checkErrorInResponse(message);
                // Check message type and send appropriate response.
                // This send-receive is the most basic form to read a tag in llrp.
                switch (message.getType()) {
                    // TODO:
                    // case messageC.GET_READER_CONFIG_RESPONSE:
                    //      handleGetReaderConfig(message);
                    //      break;
                    case messagesType_1.MessagesType.READER_EVENT_NOTIFICATION:
                        this.handleReaderNotification(message);
                        break;
                    case messagesType_1.MessagesType.DELETE_ACCESSSPEC_RESPONSE:
                    case messagesType_1.MessagesType.SET_READER_CONFIG_RESPONSE:
                    case messagesType_1.MessagesType.CUSTOM_MESSAGE:
                        this.handleReaderConfiguration();
                        break;
                    case messagesType_1.MessagesType.ADD_ROSPEC_RESPONSE:
                        this.sendEnableRospec(true);
                        break;
                    case messagesType_1.MessagesType.ENABLE_ROSPEC_RESPONSE:
                        if (this.sendEnableRospecOnceMore) {
                            this.sendEnableRospec(false);
                        }
                        else {
                            this.sendStartROSpec();
                        }
                        break;
                    case messagesType_1.MessagesType.DISABLE_ROSPEC_RESPONSE:
                        if (!this.lastLlrpStatusCode) {
                            this.emit(llrp_1.RfidReaderEvent.DisabledRadioOperation);
                        }
                        break;
                    case messagesType_1.MessagesType.DELETE_ROSPEC_RESPONSE:
                        if (!this.allReaderRospecDeleted) {
                            this.allReaderRospecDeleted = true;
                            this.handleReaderConfiguration();
                        }
                        else {
                            this.sendMessage(this.client, getLlrpMessage_1.GetLlrpMessage.closeConnection());
                        }
                        break;
                    case messagesType_1.MessagesType.START_ROSPEC_RESPONSE:
                        if (!this.lastLlrpStatusCode) {
                            this.emit(llrp_1.RfidReaderEvent.StartedRadioOperation);
                        }
                        this.sendMessage(this.client, getLlrpMessage_1.GetLlrpMessage.enableEventsAndReport());
                        break;
                    case messagesType_1.MessagesType.RO_ACCESS_REPORT:
                        this.handleROAccessReport(message);
                        break;
                    case messagesType_1.MessagesType.KEEPALIVE:
                        this.sendMessage(this.client, getLlrpMessage_1.GetLlrpMessage.keepAliveAck());
                        break;
                    default:
                        // Default, doing nothing.
                        this.log(`default: ${message.getTypeName()}`);
                }
            }
        });
    }
    checkErrorInResponse(message) {
        const param = decode_1.decodeParameter(message.getParameter());
        if (!param) {
            return;
        }
        param.forEach((decodedParameters) => {
            // read LLRPStatus Parameter only.
            if (decodedParameters.type === parametersConstants_1.default.LLRPStatus) {
                const statusCode = decodedParameters.value.readInt16BE(0);
                if (statusCode) {
                    const errorDescriptionByteCount = decodedParameters.value.readInt16BE(2);
                    const errorDescriptionBuffer = Buffer.allocUnsafe(errorDescriptionByteCount);
                    decodedParameters.value.copy(errorDescriptionBuffer, 0, 4, errorDescriptionByteCount + 4);
                    const errorDescription = `${errorDescriptionBuffer.toString('utf8')} in ${message.getTypeName()}`;
                    this.emit(llrp_1.RfidReaderEvent.LlrpError, new Error(`${statusCode}: ${errorDescription}`));
                }
                this.lastLlrpStatusCode = statusCode;
            }
        });
    }
    handleReaderNotification(message) {
        const parametersKeyValue = decode_1.decodeParameter(message.getParameter());
        parametersKeyValue.forEach((decodedParameters) => {
            if (decodedParameters.type === parametersConstants_1.default.ReaderEventNotificationData) {
                const subParameters = this.mapSubParameters(decodedParameters);
                if (subParameters[parametersConstants_1.default.ROSpecEvent]) {
                    // Event type is End of ROSpec
                    if (subParameters[parametersConstants_1.default.ROSpecEvent].readUInt8(0) === 1) {
                        // We only have 1 ROSpec so obviously it would be that.
                        // So we would not care about the ROSpecID and
                        // just reset flag for START_ROSPEC.
                        this.resetIsStartROSpecSent();
                    }
                }
            }
        });
        if (!this.enableTransmitter) {
            return;
        }
        // global configuration and enabling reports has not been set.
        if (!this.isReaderConfigReset) { // reset them.
            this.client.write(getLlrpMessage_1.GetLlrpMessage.resetConfigurationToFactoryDefaults());
            this.isReaderConfigReset = true; // we have reset the reader configuration.
        }
        else {
            this.sendStartROSpec();
        }
    }
    handleReaderConfiguration() {
        if (!this.allReaderAccessSpecDeleted) {
            this.sendMessage(this.client, getLlrpMessage_1.GetLlrpMessage.deleteAllAccessSpec());
            this.allReaderAccessSpecDeleted = true;
        }
        else if (!this.allReaderRospecDeleted) {
            this.sendMessage(this.client, getLlrpMessage_1.GetLlrpMessage.deleteAllROSpecs());
        }
        else if (!this.isExtensionsEnabled) {
            // enable extensions for impinj reader
            this.sendMessage(this.client, getLlrpMessage_1.GetLlrpMessage.enableExtensions());
            this.isExtensionsEnabled = true;
        }
        else if (!this.isReaderConfigSet) { // set them.
            this.sendMessage(this.client, getLlrpMessage_1.GetLlrpMessage.setReaderConfig()); // send SET_READER_CONFIG, global reader configuration in reading tags.
            this.isReaderConfigSet = true; // we have set the reader configuration.
        }
        else {
            this.sendMessage(this.client, getLlrpMessage_1.GetLlrpMessage.addRoSpec(defaultRoSpecId, this.radioOperationConfig));
        }
    }
    handleROAccessReport(message) {
        process.nextTick(() => {
            // show current date.
            this.log(`RO_ACCESS_REPORT at ${(new Date()).toString()}`);
            // read Parameters
            // this contains the TagReportData
            const parametersKeyValue = decode_1.decodeParameter(message.getParameter());
            if (parametersKeyValue) {
                parametersKeyValue.forEach((decodedParameters) => {
                    // read TagReportData Parameter only.
                    if (decodedParameters.type === parametersConstants_1.default.TagReportData) {
                        const tag = {};
                        const subParameters = this.mapSubParameters(decodedParameters);
                        if (subParameters[parametersConstants_1.default.EPC96]) {
                            tag.EPC96 = subParameters[parametersConstants_1.default.EPC96].toString('hex');
                        }
                        if (subParameters[parametersConstants_1.default.EPCData]) {
                            tag.EPCData = subParameters[parametersConstants_1.default.EPCData].toString('hex');
                        }
                        if (subParameters[parametersConstants_1.default.AntennaID]) {
                            tag.antennaID = subParameters[parametersConstants_1.default.AntennaID].readUInt16BE(0);
                        }
                        if (subParameters[parametersConstants_1.default.TagSeenCount]) {
                            tag.tagSeenCount = subParameters[parametersConstants_1.default.TagSeenCount].readUInt16BE(0);
                        }
                        if (subParameters[parametersConstants_1.default.PeakRSSI]) {
                            tag.peakRSSI = subParameters[parametersConstants_1.default.PeakRSSI].readInt8(0);
                        }
                        if (subParameters[parametersConstants_1.default.ROSpecID]) {
                            tag.roSpecID = subParameters[parametersConstants_1.default.ROSpecID].readUInt32BE(0);
                        }
                        if (subParameters[parametersConstants_1.default.SpecIndex]) {
                            tag.specIndex = subParameters[parametersConstants_1.default.SpecIndex].readUInt16BE(0);
                        }
                        if (subParameters[parametersConstants_1.default.InventoryParameterSpecID]) {
                            tag.inventoryParameterSpecID = subParameters[parametersConstants_1.default.InventoryParameterSpecID].readUInt16BE(0);
                        }
                        if (subParameters[parametersConstants_1.default.ChannelIndex]) {
                            tag.channelIndex = subParameters[parametersConstants_1.default.ChannelIndex].readUInt16BE(0);
                        }
                        if (subParameters[parametersConstants_1.default.C1G2PC]) {
                            tag.C1G2PC = subParameters[parametersConstants_1.default.C1G2PC].readUInt16BE(0);
                        }
                        if (subParameters[parametersConstants_1.default.C1G2CRC]) {
                            tag.C1G2CRC = subParameters[parametersConstants_1.default.C1G2CRC].readUInt16BE(0);
                        }
                        if (subParameters[parametersConstants_1.default.AccessSpecID]) {
                            tag.accessSpecID = subParameters[parametersConstants_1.default.AccessSpecID].readUInt32BE(0);
                        }
                        if (subParameters[parametersConstants_1.default.FirstSeenTimestampUTC]) {
                            // Note: Here is losing precision because JS numbers are defined to be double floats
                            const firstSeenTimestampUTCus = new Int64(subParameters[parametersConstants_1.default.FirstSeenTimestampUTC], 0);
                            tag.firstSeenTimestampUTC = firstSeenTimestampUTCus.toNumber(true); // microseconds
                        }
                        if (subParameters[parametersConstants_1.default.LastSeenTimestampUTC]) {
                            // Note: Here is losing precision because JS numbers are defined to be double floats
                            const lastSeenTimestampUTCus = new Int64(subParameters[parametersConstants_1.default.LastSeenTimestampUTC], 0);
                            tag.lastSeenTimestampUTC = lastSeenTimestampUTCus.toNumber(true); // microseconds
                        }
                        if (subParameters[parametersConstants_1.default.Custom]) {
                            tag.custom = subParameters[parametersConstants_1.default.Custom].toString('hex');
                            if (this.radioOperationConfig.enableReadingTid && this.isExtensionsEnabled) {
                                // parse impinj parameter
                                const impinjParameterSubtype = subParameters[parametersConstants_1.default.Custom].readUInt32BE(4);
                                switch (impinjParameterSubtype) {
                                    case parameters_1.CustomParameterSubType.IMPINJ_SERIALIZED_TID:
                                        tag.TID = subParameters[parametersConstants_1.default.Custom].toString('hex', 10);
                                        break;
                                }
                            }
                        }
                        this.log(`\tEPCData: ${tag.EPCData} \tEPC96: ${tag.EPC96} \tTID: ${tag.TID} \tRead count: ${tag.tagSeenCount} \tAntenna ID: ${tag.antennaID} \tLastSeenTimestampUTC: ${tag.lastSeenTimestampUTC}`);
                        if (tag.TID || tag.EPCData || tag.EPC96) {
                            process.nextTick(() => {
                                this.emit(llrp_1.RfidReaderEvent.DidSeeTag, tag);
                            });
                        }
                    }
                });
            }
        });
    }
    /**
     * Send message to rfid and write logs.
     *
     * @param  {[type]} client  rfid connection.
     * @param  {Buffer} buffer  to write.
     */
    sendMessage(client, buffer) {
        if (!client || (client && client.destroyed)) {
            return;
        }
        process.nextTick(() => {
            this.log(`Sending ${this.getMessageName(buffer)}`);
            this.client.write(buffer);
        });
    }
    /**
     * Gets the name of the message using the encoded Buffer.
     *
     * @param  {Buffer} data
     * @return {string} name of the message
     */
    getMessageName(data) {
        // get the message code
        // get the name from the constants.
        return messagesType_1.MessagesType[this.getMessage(data)];
    }
    /**
     * Gets the message type using the encoded Buffer.
     *
     * @param  {Buffer} data
     * @return {int} corresponding message type code.
     */
    getMessage(data) {
        // message type resides on the first 2 bits of the first octet
        // and 8 bits of the second octet.
        return (data[0] & 3) << 8 | data[1];
    }
    sendEnableRospec(sendTwoTimes) {
        this.sendEnableRospecOnceMore = sendTwoTimes ? true : false;
        this.sendMessage(this.client, getLlrpMessage_1.GetLlrpMessage.enableRoSpec(defaultRoSpecId));
    }
    /**
     * Sends a START_ROSPEC message if it has not been sent.
     *
     * @return {Int} returns the length written or false if there was an error writing.
     */
    sendStartROSpec() {
        // START_ROSPEC has not been sent.
        if (!this.isStartROSpecSent) {
            this.isStartROSpecSent = true; // change state of flag.
            this.sendMessage(this.client, getLlrpMessage_1.GetLlrpMessage.startRoSpec(defaultRoSpecId));
        }
    }
    /**
     * Resets the isStartROSpecSent flag to false.
     */
    resetIsStartROSpecSent() {
        this.isStartROSpecSent = false;
    }
    /**
     * Simple helper function to map key value pairs using the typeName and value.
     * Probably should be built in with LLRPParameter class.
     *
     * @param  {Object} decodedParameters  object returned from decode.parameter.
     * @return {Object}  the key value pair.
     */
    mapSubParameters(decodedParameters) {
        // create an object that will hold a key valuemapSubParameters pair.
        const properties = {};
        const subP = decodedParameters.subParameters;
        for (const tag in subP) {
            // where key is the Parameter type.
            // and value is the Parameter value as Buffer object.
            properties[subP[tag].type] = subP[tag].value;
        }
        return properties;
    }
}
exports.LLRP = LLRP;
//# sourceMappingURL=index.js.map