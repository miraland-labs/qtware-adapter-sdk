import EventEmitter from 'eventemitter3';
import { PublicKey, Transaction } from '@solarti/web3.js';

export default abstract class WalletAdapter extends EventEmitter {
  abstract get publicKey (): PublicKey | null;
  abstract get connected (): boolean;

  abstract connect (): Promise<void>;
  abstract disconnect (): Promise<void>;
  abstract signTransaction (transaction: Transaction): Promise<Transaction>;
  abstract signAllTransactions (transactions: Transaction[]): Promise<Transaction[]>;
  abstract signMessage (data: Uint8Array, display: 'hex' | 'utf8'): Promise<Uint8Array>;
}
