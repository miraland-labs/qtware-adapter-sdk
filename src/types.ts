import { Cluster } from '@solarti/web3.js';

// Change all `Salmon` to `Qtware`
export interface QtwareWindow extends Window {
  qtware?: QtwareWallet;
}

export interface QtwareWallet {
  postMessage(...args: unknown[]): unknown;
}

export interface QtwareConfig {
  network?: Cluster,
  provider?: string | QtwareWallet
}

export type PromiseCallback = (...args: unknown[]) => unknown;
