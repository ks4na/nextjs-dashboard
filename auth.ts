import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

async function getUser(email: string) {
  try {
    // const user = await sql`
    //   SELECT * FROM users WHERE email=${email}
    // `;
    // return user.rows[0];
    return {
      id: '410544b2-4001-4271-9855-fec4b6a6442a',
      name: 'User',
      email: 'user@nextmail.com',
      password: '$2b$10$BcGF.0t48bk6RWoeE3g3feo2hkivubhDvASxQNpvMGBdqIFxQrbaW',
    };
  } catch (err) {
    console.log('Failed to fetch user: ', err);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parseResult = await z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParseAsync(credentials);

        if (!parseResult.success) {
          return null;
        }

        const { email, password } = parseResult.data;
        const user = await getUser(email);
        if (!user) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          return null;
        }

        return user;
      },
    }),
  ],
});
