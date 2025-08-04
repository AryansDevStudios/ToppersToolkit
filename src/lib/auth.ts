'use server';

export async function verifyAuth(token: string | undefined) {
    if (token === 'true') {
        return { authenticated: true };
    }
    return { authenticated: false };
}
