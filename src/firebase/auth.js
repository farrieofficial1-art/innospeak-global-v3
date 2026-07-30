import { app, isConfigured } from './config.js';

export function getAuthInstance() {
  if (!isConfigured || !app) return null;
  // Firebase auth intentionally not initialized in this stub.
  return null;
}

export async function signIn() {
  throw new Error('Firebase auth not configured');
}

export async function signOutUser() {
  throw new Error('Firebase auth not configured');
}

export function onAuthChange() {
  // No-op listener for unconfigured environments.
  return () => {};
}
