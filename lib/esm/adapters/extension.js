import WalletAdapter from './base';
import Wallet from '@solarti/slrt-wallet-adapter';
export default class ExtensionAdapter extends WalletAdapter {
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
    async connect() {
        this._instance = new Wallet(this._provider, this._network);
        this._instance.on('connect', this._handleConnect);
        this._instance.on('disconnect', this._handleDisconnect);
        await this._instance.connect();
    }
    async disconnect() {
        if (!this.connected) {
            throw new Error('Wallet not connected');
        }
        this._instance.removeAllListeners('connect');
        this._instance.removeAllListeners('disconnect');
        await this._instance.disconnect();
    }
    async signTransaction(transaction) {
        if (!this.connected) {
            throw new Error('Wallet not connected');
        }
        return await this._instance.signTransaction(transaction);
    }
    async signAllTransactions(transactions) {
        if (!this.connected) {
            throw new Error('Wallet not connected');
        }
        return await this._instance.signAllTransactions(transactions);
    }
    async signMessage(data, display = 'hex') {
        if (!this.connected) {
            throw new Error('Wallet not connected');
        }
        const { signature } = await this._instance.sign(data, display);
        return Uint8Array.from(signature);
    }
}
//# sourceMappingURL=extension.js.map