"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const web_1 = __importDefault(require("./adapters/web"));
const extension_1 = __importDefault(require("./adapters/extension"));
class Qtware extends eventemitter3_1.default {
    constructor(config) {
        var _a;
        super();
        // private _network: Cluster = 'mainnet-beta';
        this._network = 'mainnet-mln';
        this._adapterInstance = null;
        this._connectHandler = null;
        this._connected = () => {
            if (this._connectHandler) {
                this._connectHandler.resolve();
                this._connectHandler = null;
            }
            this.emit('connect', this.publicKey);
        };
        this._disconnected = () => {
            if (this._connectHandler) {
                this._connectHandler.reject();
                this._connectHandler = null;
            }
            this._adapterInstance = null;
            this.emit('disconnect');
        };
        if (config === null || config === void 0 ? void 0 : config.network) {
            this._network = config === null || config === void 0 ? void 0 : config.network;
        }
        if (config === null || config === void 0 ? void 0 : config.provider) {
            this._provider = config === null || config === void 0 ? void 0 : config.provider;
        }
        else if (typeof ((_a = window.qtware) === null || _a === void 0 ? void 0 : _a.postMessage) === 'function') {
            this._provider = window.qtware;
        }
        else {
            // this._provider = 'https://app.qtware.io';
            this._provider = 'https://app.arcaps.com';
        }
    }
    get publicKey() {
        var _a;
        return ((_a = this._adapterInstance) === null || _a === void 0 ? void 0 : _a.publicKey) || null;
    }
    get isConnected() {
        var _a;
        return !!((_a = this._adapterInstance) === null || _a === void 0 ? void 0 : _a.connected);
    }
    get connected() {
        return this.isConnected;
    }
    get autoApprove() {
        return false;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connected) {
                return;
            }
            const AdapterClass = typeof this._provider === 'string' ? web_1.default : extension_1.default;
            this._adapterInstance = new AdapterClass(this._provider, this._network);
            this._adapterInstance.on('connect', this._connected);
            this._adapterInstance.on('disconnect', this._disconnected);
            this._adapterInstance.connect();
            yield new Promise((resolve, reject) => {
                this._connectHandler = { resolve, reject };
            });
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._adapterInstance) {
                return;
            }
            yield this._adapterInstance.disconnect();
        });
    }
    signTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connected) {
                throw new Error('Wallet not connected');
            }
            return yield this._adapterInstance.signTransaction(transaction);
        });
    }
    signAllTransactions(transactions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connected) {
                throw new Error('Wallet not connected');
            }
            return yield this._adapterInstance.signAllTransactions(transactions);
        });
    }
    signMessage(data, display = 'utf8') {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connected) {
                throw new Error('Wallet not connected');
            }
            return yield this._adapterInstance.signMessage(data, display);
        });
    }
    sign(data, display = 'utf8') {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.signMessage(data, display);
        });
    }
}
exports.default = Qtware;
//# sourceMappingURL=index.js.map