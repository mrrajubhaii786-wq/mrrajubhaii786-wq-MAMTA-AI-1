const isServer = typeof window === 'undefined';

const getEnv = (key: string): string | undefined => {
  if (isServer) {
    return process.env[key];
  }
  // Client side fallback through Vite's import.meta.env
  // @ts-ignore
  return (import.meta.env && import.meta.env[`VITE_${key}`]) || (globalThis as any)[`__MAMTA_${key}__`];
};

const firebaseConfig = {
  apiKey: getEnv('FIREBASE_API_KEY') || 'AIzaSyC8HWUzUUn7X0WsF_J0KlbkX3BVsLi_YVk',
  authDomain: getEnv('FIREBASE_AUTH_DOMAIN') || 'linen-transport-4f4nj.firebaseapp.com',
  projectId: getEnv('FIREBASE_PROJECT_ID') || 'linen-transport-4f4nj',
  storageBucket: getEnv('FIREBASE_STORAGE_BUCKET') || 'linen-transport-4f4nj.firebasestorage.app',
  messagingSenderId: getEnv('FIREBASE_MESSAGING_SENDER_ID') || '553483848333',
  appId: getEnv('FIREBASE_APP_ID') || '1:553483848333:web:ea2816fb852e5f9a9030c4',
  measurementId: getEnv('FIREBASE_MEASUREMENT_ID') || '',
  firestoreDatabaseId: 'ai-studio-mamtaai-6b016f9d-0d42-4d7f-bef0-f1b6ad92a243',
};

export default firebaseConfig;
