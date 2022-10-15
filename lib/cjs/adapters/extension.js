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
const base_1 = __importDefault(require("./base"));
const slrt_wallet_adapter_1 = __importDefault(require("@solarti/slrt-wallet-adapter"));
class ExtensionAdapter extends base_1.default {
    // @ts-ignore
    constructor(provider, network) {
        super();
        this._instance = null;
        this._handleConnect = () => {
            this.emit('connect');
        };
        this._handleDisconnect = () => {
            this.emit('disconnect');
        };
        this._provider = provider;
        this._network = network;
    }
    get publicKey() {
        return this._instance.publicKey || null;
    }
    get connected() {
        return this._instance.connected || false;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this._instance = new slrt_wallet_adapter_1.default(this._provider, this._network);
            this._instance.on('connect', this._handleConnect);
            this._instance.on('disconnect', this._handleDisconnect);
            yield this._instance.connect();
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connected) {
                throw new Error('Wallet not connected');
            }
            this._instance.removeAllListeners('connect');
            this._instance.removeAllListeners('disconnect');
            yield this._instance.disconnect();
        });
    }
    signTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connected) {
                throw new Error('Wallet not connected');
            }
            return yield this._instance.signTransaction(transaction);
        });
    }
    signAllTransactions(transactions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connected) {
                throw new Error('Wallet not connected');
            }
            return yield this._instance.signAllTransactions(transactions);
        });
    }
    signMessage(data, display = 'hex') {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connected) {
                throw new Error('Wallet not connected');
            }
            const { signature } = yield this._instance.sign(data, display);
            return Uint8Array.from(signature);
        });
    }
}
exports.default = ExtensionAdapter;
//# sourceMappingURL=extension.js.map