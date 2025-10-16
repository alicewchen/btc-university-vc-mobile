export const handleResponse = (_url: string) => {
  // Coinbase mobile SDK not available in this environment; ignore callbacks.
};

export const configure = (_options: {
  callbackURL: URL;
  hostPackageName: string;
  hostURL: URL;
}) => {
  // No-op; only needed when the native SDK is present.
};

const shim = {
  handleResponse,
  configure,
};

export default shim;
