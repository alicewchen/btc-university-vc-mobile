import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';

type ToastVariant = 'default' | 'destructive' | 'success';

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
  dismiss: () => void;
}

interface ToastState extends ToastOptions {
  visible: boolean;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const VARIANT_STYLES: Record<ToastVariant, { backgroundColor: string }> = {
  default: { backgroundColor: '#1F2937' },
  destructive: { backgroundColor: '#B91C1C' },
  success: { backgroundColor: '#047857' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toastState, setToastState] = useState<ToastState>({
    visible: false,
    title: undefined,
    description: undefined,
    variant: 'default',
  });

  const showToast = useCallback((options: ToastOptions) => {
    setToastState({
      visible: true,
      title: options.title,
      description: options.description,
      variant: options.variant ?? 'default',
    });
  }, []);

  const dismiss = useCallback(() => {
    setToastState((prev) => ({ ...prev, visible: false }));
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      toast: showToast,
      dismiss,
    }),
    [showToast, dismiss],
  );

  const { visible, title, description, variant = 'default' } = toastState;
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={dismiss}
        duration={4000}
        style={[styles.snackbar, variantStyle]}
        action={{ label: 'Dismiss', onPress: dismiss }}
        wrapperStyle={styles.wrapper}
      >
        <View>
          {title ? (
            <Text variant="titleSmall" style={styles.title}>
              {title}
            </Text>
          ) : null}
          {description ? (
            <Text variant="bodySmall" style={styles.description}>
              {description}
            </Text>
          ) : null}
        </View>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  wrapper: {
    bottom: 32,
  },
  snackbar: {
    borderRadius: 12,
  },
  title: {
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    opacity: 0.9,
  },
});
