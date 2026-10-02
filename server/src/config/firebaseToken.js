import { createRemoteJWKSet, jwtVerify } from 'jose';
import { ApiError } from '../utils/apiError.js';

const googlePublicKeys = createRemoteJWKSet(
    new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

const verifyFirebaseToken = async (idToken) => {
    const projectId = process.env.FIREBASE_PROJECT_ID || 'interviewiqai-b7b6e';

    if (!projectId) {
        throw new ApiError(500, 'Firebase project ID is not configured');
    }

    // Verify signature, project audience and Firebase issuer before using token data.
    const { payload } = await jwtVerify(idToken, googlePublicKeys, {
        algorithms: ['RS256'],
        audience: projectId,
        issuer: `https://securetoken.google.com/${projectId}`,
    });

    if (!payload.sub) {
        throw new ApiError(401, 'Invalid Google token subject');
    }

    return { ...payload, uid: payload.sub };
};

export { verifyFirebaseToken };
