import { Cluster, Transaction } from '@solarti/web3.js';
import {
  PromiseCallback,
  QtwareWallet,
  QtwareConfig,
  QtwareWindow,
} from './types';
import EventEmitter from 'eventemitter3';
import WalletAdapter from './adapters/base';
import WebAdapter from './adapters/web';
import ExtensionAdapter from './adapters/extension';

// m17, to resovle '--isolatedModules' flag provided, change to export type, vanilla: export
export type { QtwareWallet, QtwareConfig } from './types';

declare const window: QtwareWindow;

export default class Qtware extends EventEmitter {
  // private _network: Cluster = 'mainnet-beta';
  private _network: Cluster = 'mainnet-slrt';
  private _provider: string | QtwareWallet;
  private _adapterInstance: WalletAdapter | null = null;
  private _connectHandler: { resolve: PromiseCallback, reject: PromiseCallback } | null = null;

  constructor (config?: QtwareConfig) {
    super();

    if (config?.network) {
      this._network = config?.network;
    }

    if (config?.provider) {
      this._provider = config?.provider;
    } else if (typeof window.qtware?.postMessage === 'function') {
      this._provider = window.qtware;
    } else {
      // this._provider = 'https://app.QtwareWallet.io';
      this._provider = 'https://qtw.arcaps.com';
    }
  }

  get publicKey () {
    return this._adapterInstance?.publicKey || null;
  }

  get isConnected () {
    return !!this._adapterInstance?.connected;
  }

  get connected () {
    return this.isConnected;
  }

  get autoApprove () {
    return false;
  }

  async connect () {
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

  async disconnect () {
    if (!this._adapterInstance) {
      return;
    }

    await this._adapterInstance.disconnect();
  }

  async signTransaction (transaction: Transaction): Promise<Transaction> {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }

    return await this._adapterInstance!.signTransaction(transaction);
  }

  async signAllTransactions (transactions: Transaction[]): Promise<Transaction[]> {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }

    return await this._adapterInstance!.signAllTransactions(transactions);
  }

  async signMessage (data: Uint8Array, display: 'hex' | 'utf8' = 'utf8'): Promise<Uint8Array> {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }

    return await this._adapterInstance!.signMessage(data, display);
  }

  async sign (data: Uint8Array, display: 'hex' | 'utf8' = 'utf8'): Promise<Uint8Array> {
    return await this.signMessage(data, display);
  }

  private _connected = () => {
    if (this._connectHandler) {
      this._connectHandler.resolve();
      this._connectHandler = null;
    }

    this.emit('connect', this.publicKey);
  };

  private _disconnected = () => {
    if (this._connectHandler) {
      this._connectHandler.reject();
      this._connectHandler = null;
    }

    this._adapterInstance = null;

    this.emit('disconnect');
  };
}
