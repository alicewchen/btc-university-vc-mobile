const UNSUPPORTED_MESSAGE =
  '@aws-sdk/client-kms is not available in this environment. Configure AWS KMS support or disable features that depend on it.';

export class KMSClient {
  constructor(_config?: unknown) {
    // Constructing is allowed so we can defer failure until the SDK is actually used.
  }

  async send(_command: unknown): Promise<never> {
    throw new Error(UNSUPPORTED_MESSAGE);
  }
}

export class GenerateDataKeyCommand {
  constructor(_input?: unknown) {
    // Stub command; no-op as AWS KMS is not supported in Expo-managed builds.
  }
}
