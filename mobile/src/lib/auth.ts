// Wallet authentication utilities for React Native

export interface SignedRequest {
  walletAddress: string;
  signature: string;
  message: string;
  timestamp: string;
}

export async function signAuthMessage(account: any): Promise<SignedRequest> {
  if (!account?.address) {
    throw new Error('Wallet not connected');
  }

  const timestamp = Date.now().toString();
  const message = `Authenticate with Bitcoin University: ${timestamp}`;

  const signature = await account.signMessage({ message });

  return {
    walletAddress: account.address,
    signature,
    message,
    timestamp,
  };
}

export function createAuthenticatedRequest<T extends Record<string, unknown>>(
  data: T,
  signedAuth: SignedRequest,
) {
  return {
    ...data,
    ...signedAuth,
  };
}
