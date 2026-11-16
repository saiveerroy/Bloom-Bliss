
import "dotenv/config";

import {
  initializeApp,
  cert,
  getApps,
} from "firebase-admin/app";

import { getFirestore } from "firebase-admin/firestore";

function getServiceAccount() {
  const credentials = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!credentials) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT environment variable is missing."
    );
  }

  const serviceAccount = JSON.parse(credentials);

  return {
    ...serviceAccount,
    private_key: serviceAccount.private_key.replace(/\\n/g, "\n"),
  };
}

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(getServiceAccount()),
      });

const db = getFirestore(app);

export { app, db };
