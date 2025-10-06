// Wallet authentication utilities
export interface SignedRequest {
  walletAddress: string;
  signature: string;
  message: string;
  timestamp: string;
}

// Sign a message with wallet for authentication
export async function signAuthMessage(account: any): Promise<SignedRequest> {
  if (!account?.address) {
    throw new Error("Wallet not connected");
  }
  
  const timestamp = Date.now().toString();
  const message = `Authenticate with Bitcoin University: ${timestamp}`;
  
  try {
    const signature = await account.signMessage({
      message,
    });
    
    return {
      walletAddress: account.address,
      signature,
      message,
      timestamp
    };
  } catch (error) {
    console.error("Error signing message:", error);
    throw new Error("Failed to sign authentication message");
  }
}

// Create authenticated API request body
export function createAuthenticatedRequest(data: any, signedAuth: SignedRequest) {
  return {
    ...data,
    ...signedAuth
  };
}