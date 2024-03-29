import WalletAdapter from './base.js';
import { Cluster, Transaction } from '@solarti/web3.js';
import Wallet from '@solarti/slrt-wallet-adapter';
import { QtwareWallet } from '../types';

export default class ExtensionAdapter extends WalletAdapter {
  private _instance: Wallet | null = null;
  private _provider: string | QtwareWallet;
  private _network: Cluster;

  get publicKey () {
    return this._instance!.publicKey || null;
  }

  get connected () {
    return this._instance!.connected || false;
  }

  // @ts-ignore
  constructor (provider: string | QtwareWallet, network: Cluster) {
    super();
    this._provider = provider;
    this._network = network;
  }

  async connect () {
    this._instance = new Wallet(this._provider, this._network);

    this._instance.on('connect', this._handleConnect);
    this._instance.on('disconnect', this._handleDisconnect);

    await this._instance.connect();
  }

  async disconnect () {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }

    this._instance!.removeAllListeners('connect');
    this._instance!.removeAllListeners('disconnect');

    await this._instance!.disconnect();
  }

  async signTransaction (transaction: Transaction): Promise<Transaction> {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }

    return await this._instance!.signTransaction(transaction);
  }

  async signAllTransactions (transactions: Transaction[]): Promise<Transaction[]> {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }

    return await this._instance!.signAllTransactions(transactions);
  }

  async signMessage (data: Uint8Array, display: 'hex' | 'utf8' = 'hex'): Promise<Uint8Array> {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }

    const { signature } = await this._instance!.sign(data, display);
    return Uint8Array.from(signature);
  }

  private _handleConnect = () => {
    this.emit('connect');
  };

  private _handleDisconnect = () => {
     this.emit('disconnect');
  };
}