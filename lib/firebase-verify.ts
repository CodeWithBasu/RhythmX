import { createRemoteJWKSet, jwtVerify } from 'jose';

const projectId = 'rhythmx-39fcd';
const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

export async function verifyFirebaseToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: "https://securetoken.google.com/$projectId",
      audience: projectId,
    });
    return payload;
  } catch (error) {
    console.error("JWT Verification failed:", error);
    return null;
  }
}
