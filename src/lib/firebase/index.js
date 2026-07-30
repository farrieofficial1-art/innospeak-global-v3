/**
 * Firebase initialization.
 *
 * Initializes the Firebase app and lazily exports the services the app
 * will use (Auth, Firestore, Analytics). Initialization is guarded so
 * that importing these modules never throws while credentials are still
 * unconfigured — they simply resolve to `null` and callers can no-op.
 *
 * To enable Firebase:
 *   1. Copy `.env.example` to `.env` and add your Firebase web config.
 *   2. Restart the dev server so Vite picks up the new env vars.
 */

import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  getAuth,
  // connectAuthEmulator, // uncomment when using the local Auth emulator
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './config.js';

const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

// Initialize once, reuse across hot reloads.
const app = getApps().length ? getApp() : isConfigured ? initializeApp(firebaseConfig) : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const isFirebaseReady = isConfigured;

export default app;
