import {createTRPCProxyClient, httpBatchLink} from '@trpc/client';
import type {AppRouter} from '../../../backend/src/index';
import {createClient} from './supabase/server';

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_TRPC_URL || 'http://localhost:3001/trpc',
      async headers() {
        const token = await getAccessToken();
        return {
          Authorization: token ? `Bearer ${token}` : undefined,
          credentials: 'include',
        };
      },
    }),
  ],
});

async function getAccessToken() {
  const supabase = createClient();
  const {
    data: {session},
  } = await (await supabase).auth.getSession();
  return session?.access_token;
}
