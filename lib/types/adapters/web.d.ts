import WalletAdapter from './base';
import { Cluster, Transaction } from '@solarti/web3.js';
import { QtwareWallet } from '../types';
export default class WebAdapter extends WalletAdapter {
    private _instance;
    private _provider;
    private _network;
    private _pollTimer;
    get publicKey(): import("@solarti/web3.js").PublicKey | null;
    get connected(): boolean;
    constructor(provider: string | QtwareWallet, network: Cluster);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction(transaction: Transaction): Promise<Transaction>;
    signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
    signMessage(data: Uint8Array, display?: 'hex' | 'utf8'): Promise<Uint8Array>;
    private _handleConnect;
    private _handleDisconnect;
}
//# sourceMappingURL=web.d.ts.map