// lib/auth.ts
import { NextApiRequest } from 'next'; // <-- Use NextApiRequest for Pages Router
import jwt from 'jsonwebtoken';

/**
 * Verifies the JWT from the Authorization header of a request.
 * @param request The incoming NextApiRequest object from a Pages Router API route.
 * @returns The user's ID if the token is valid, otherwise null.
 */
export const getUserIdFromToken = (request: NextApiRequest): string | null => {
    const authHeader = request.headers['authorization']; // <-- Access headers directly
    const token = authHeader && authHeader.split(' ')[1]; // Expects "Bearer TOKEN"

    if (!token) {
        return null;
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        return decoded.userId;
    } catch (error) {
        // Token is invalid or expired
        console.error('JWT Verification Error:', error);
        return null;
    }
};
