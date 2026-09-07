import { createRemoteJWKSet, jwtVerify } from 'jose';

const projectId = 'rhythmx-39fcd';
const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

export async function verifyFirebaseToken(token: string) {
  try {
    const cleanToken = token.trim();
    const { payload } = await jwtVerify(cleanToken, JWKS, {
      issuer: 'https://securetoken.google.com/' + projectId,
      audience: projectId,
      clockTolerance: 120, // allow 2 minutes of clock skew
    });
    return payload;
  } catch (error: any) {
    console.error("JWT Verification failed. EXACT ERROR:", error.code, error.message);
    return null;
  }
}
