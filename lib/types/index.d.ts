import { Transaction } from '@solarti/web3.js';
import { QtwareConfig } from './types';
import EventEmitter from 'eventemitter3';
export type { QtwareWallet, QtwareConfig } from './types';
export default class Qtware extends EventEmitter {
    private _network;
    private _provider;
    private _adapterInstance;
    private _connectHandler;
    constructor(config?: QtwareConfig);
    get publicKey(): import("@solarti/web3.js").PublicKey | null;
    get isConnected(): boolean;
    get connected(): boolean;
    get autoApprove(): boolean;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction(transaction: Transaction): Promise<Transaction>;
    signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
    signMessage(data: Uint8Array, display?: 'hex' | 'utf8'): Promise<Uint8Array>;
    sign(data: Uint8Array, display?: 'hex' | 'utf8'): Promise<Uint8Array>;
    private _connected;
    private _disconnected;
}
//# sourceMappingURL=index.d.ts.map