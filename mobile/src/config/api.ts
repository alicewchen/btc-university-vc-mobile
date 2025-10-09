import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * API Configuration
 * 
 * IMPORTANT: For development on physical devices or dev-client builds,
 * you MUST set the EXPO_PUBLIC_API_URL environment variable.
 * 
 * For Replit: Set to your Replit dev URL (e.g., https://your-repl.replit.dev)
 * For local network: Set to your machine's IP (e.g., http://192.168.1.100:5000)
 * 
 * Example .env file:
 * EXPO_PUBLIC_API_URL=https://your-repl.replit.dev
 */

const getApiBaseUrl = () => {
  if (__DEV__) {
    // Priority 1: Explicit environment variable (REQUIRED for physical devices)
    const envUrl = process.env.EXPO_PUBLIC_API_URL;
    if (envUrl) {
      console.log('[API Config] Using environment URL:', envUrl);
      return envUrl;
    }
    
    // Check if we're running in Expo Go (has debuggerHost or manifest hostUri)
    const debuggerHost = Constants.debuggerHost;
    const manifest = Constants.expoConfig || Constants.manifest2?.extra?.expoGo;
    const hostUri = manifest?.hostUri;
    const isExpoGo = !!(debuggerHost || hostUri);
    
    // If NOT in Expo Go (i.e., dev-client or physical device), REQUIRE env var
    if (!isExpoGo) {
      const errorMessage = 
        '⚠️ EXPO_PUBLIC_API_URL is REQUIRED for development on physical devices or dev-client builds.\n\n' +
        'Please set it in your .env file or environment:\n' +
        'EXPO_PUBLIC_API_URL=https://your-replit-url.replit.dev\n\n' +
        'See mobile/.env.example for details.';
      
      console.error('[API Config]', errorMessage);
      throw new Error(errorMessage);
    }
    
    // Priority 2: Expo Go debuggerHost
    if (debuggerHost) {
      const host = debuggerHost.split(':')[0];
      const url = `http://${host}:5000`;
      console.log('[API Config] Using Expo Go debuggerHost:', url);
      return url;
    }
    
    // Priority 3: Manifest hostUri (Expo Go fallback)
    if (hostUri) {
      const host = hostUri.split(':')[0];
      const url = `http://${host}:5000`;
      console.log('[API Config] Using Expo Go manifest hostUri:', url);
      return url;
    }
    
    // Priority 4: Platform-specific fallbacks (emulators/simulators only - should rarely reach here)
    if (Platform.OS === 'web') {
      console.log('[API Config] Using web localhost');
      return 'http://localhost:5000';
    }
    
    // Final fallback (should not reach here)
    console.warn('[API Config] Using fallback localhost - this may not work!');
    return 'http://localhost:5000';
  }
  
  // Production: Use environment variable or throw error
  const prodUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!prodUrl) {
    throw new Error('EXPO_PUBLIC_API_URL is required in production. Please set this environment variable.');
  }
  
  console.log('[API Config] Using production URL:', prodUrl);
  return prodUrl;
};

export const API_BASE_URL = getApiBaseUrl();
console.log('[API Config] Final API Base URL:', API_BASE_URL);

export const API_ENDPOINTS = {
  // DAO endpoints
  DAOS: '/api/daos',
  DAO_BY_ID: (id: string) => `/api/daos/${id}`,
  
  // Research programs
  RESEARCH_PROGRAMS: '/api/research-programs',
  
  // Publications
  PUBLICATIONS: (daoId: string) => `/api/daos/${daoId}/publications`,
  
  // Courses
  COURSES: (daoId: string) => `/api/daos/${daoId}/courses`,
  
  // Governance
  PROPOSALS: (daoId: string) => `/api/daos/${daoId}/proposals`,
  
  // Milestones
  MILESTONES: (daoId: string) => `/api/daos/${daoId}/milestones`,
  
  // Chat/Search
  CHAT: '/api/chat',
  
  // Smart contract operations
  CREATE_DAO: '/api/create-dao',
};

// Contract addresses (update these based on network)
export const CONTRACT_ADDRESSES = {
  DAO_FACTORY: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  FEE_ROUTER: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
};

// Network configuration
export const NETWORK_CONFIG = {
  LOCAL: {
    chainId: 1337,
    name: 'Localhost',
    rpcUrl: 'http://localhost:8545',
  },
  SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  },
};
