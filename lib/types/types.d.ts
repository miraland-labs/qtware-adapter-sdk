import { Cluster } from '@solarti/web3.js';
export interface QtwareWindow extends Window {
    qtware?: QtwareWallet;
}
export interface QtwareWallet {
    postMessage(...args: unknown[]): unknown;
}
export interface QtwareConfig {
    network?: Cluster;
    provider?: string | QtwareWallet;
}
export declare type PromiseCallback = (...args: unknown[]) => unknown;
//# sourceMappingURL=types.d.ts.map