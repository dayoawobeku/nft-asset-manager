import {inferAsyncReturnType} from '@trpc/server';
import {CreateFastifyContextOptions} from '@trpc/server/adapters/fastify';
import {supabase} from './utils/db';

export async function createContext({req}: CreateFastifyContextOptions) {
  const authHeader = req.headers.authorization;
  const access_token = authHeader ? authHeader.split(' ')[1] : null;

  let user = null;

  if (access_token) {
    try {
      const {
        data: {user: sessionUser},
        error: userError,
      } = await supabase.auth.getUser(access_token);

      if (userError) {
        console.error('User error:', userError);
      } else if (sessionUser) {
        user = sessionUser;
      }
    } catch (error) {
      console.error('Error in auth:', error);
    }
  }

  return {
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
