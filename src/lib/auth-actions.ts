'use server';

import { cookies } from 'next/headers';
import { getPassphrase } from './data';

export async function login(prevState: any, formData: FormData) {
  const passphrase = formData.get('passphrase');
  const correctPassphrase = await getPassphrase();

  if (passphrase === correctPassphrase) {
    const cookieStore = cookies();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    cookieStore.set('auth', 'true', { httpOnly: true, secure: true, expires });
    return { success: true, message: 'Login successful' };
  } else {
    return { success: false, message: 'Incorrect passphrase.' };
  }
}
