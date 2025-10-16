type RequestArguments = {
  method: string;
  params?: unknown[] | Record<string, unknown>;
};

export class WalletMobileSDKEVMProvider {
  constructor(_options?: { chainId?: number; jsonRpcUrl?: string }) {
    // SDK unavailable; constructor retained for compatibility.
  }

  async request<T = unknown>(_args: RequestArguments): Promise<T> {
    throw new Error('Coinbase Wallet Mobile SDK is not available in this build.');
  }
}

export default WalletMobileSDKEVMProvider;
