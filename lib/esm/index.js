import EventEmitter from 'eventemitter3';
import WebAdapter from './adapters/web.js';
import ExtensionAdapter from './adapters/extension.js';
export default class Qtware extends EventEmitter {
    constructor(config) {
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
        if (config?.network) {
            this._network = config?.network;
        }
        if (config?.provider) {
            this._provider = config?.provider;
        }
        else if (typeof window.qtware?.postMessage === 'function') {
            this._provider = window.qtware;
        }
        else {
            // this._provider = 'https://app.qtware.io';
            this._provider = 'https://app.arcaps.com';
        }
    }
    get publicKey() {
        return this._adapterInstance?.publicKey || null;
    }
    get isConnected() {
        return !!this._adapterInstance?.connected;
    }
    get connected() {
        return this.isConnected;
    }
    get autoApprove() {
        return false;
    }
    async connect() {
        if (this.connected) {
            return;
        }
        const AdapterClass = typeof this._provider === 'string' ? WebAdapter : ExtensionAdapter;
        this._adapterInstance = new AdapterClass(this._provider, this._network);
        this._adapterInstance.on('connect', this._connected);
        this._adapterInstance.on('disconnect', this._disconnected);
        this._adapterInstance.connect();
        await new Promise((resolve, reject) => {
            this._connectHandler = { resolve, reject };
        });
    }
    async disconnect() {
        if (!this._adapterInstance) {
            return;
        }
        await this._adapterInstance.disconnect();
    }
    async signTransaction(transaction) {
        if (!this.connected) {
            throw new Error('Wallet not connected');
        }
        return await this._adapterInstance.signTransaction(transaction);
    }
    async signAllTransactions(transactions) {
        if (!this.connected) {
            throw new Error('Wallet not connected');
        }
        return await this._adapterInstance.signAllTransactions(transactions);
    }
    async signMessage(data, display = 'utf8') {
        if (!this.connected) {
            throw new Error('Wallet not connected');
        }
        return await this._adapterInstance.signMessage(data, display);
    }
    async sign(data, display = 'utf8') {
        return await this.signMessage(data, display);
    }
}
//# sourceMappingURL=index.js.map