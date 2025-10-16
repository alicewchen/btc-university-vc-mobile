import { Linking } from 'react-native';

type UrlListener = (event: { url: string }) => void;

const subscriptions = new Map<UrlListener, { remove: () => void }>();

export const addEventListener = (type: 'url', listener: UrlListener) => {
  if (type !== 'url') {
    return { remove: () => {} };
  }

  const subscription = Linking.addEventListener('url', listener);
  subscriptions.set(listener, subscription);
  return subscription;
};

export const removeEventListener = (type: 'url', listener: UrlListener) => {
  if (type !== 'url') {
    return;
  }

  const subscription = subscriptions.get(listener);
  subscription?.remove();
  subscriptions.delete(listener);
};

export const openURL = (url: string) => Linking.openURL(url);
export const canOpenURL = (url: string) => Linking.canOpenURL(url);

export const createURL = (path: string) => path;

export const parse = (url: string) => ({
  path: url,
  queryParams: {},
});

export const parseURL = parse;

export default {
  addEventListener,
  removeEventListener,
  openURL,
  canOpenURL,
  createURL,
  parse,
  parseURL,
};
