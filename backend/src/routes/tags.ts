import {t, TRPCError} from '../utils/trpc';
import {supabase} from '../utils/db';

export const tagRouter = t.router({
  getTags: t.procedure.query(async () => {
    try {
      const {data, error} = await supabase.rpc('get_tags');

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      return data;
    } catch (error) {
      console.error('Error in getTags:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while fetching tags',
      });
    }
  }),
});
