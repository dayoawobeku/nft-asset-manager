import {t, TRPCError} from '../trpc';
import {supabase} from '../utils/db';

export const tagRouter = t.router({
  getTags: t.procedure.query(async () => {
    const {data: tags, error} = await supabase
      .from('tags')
      .select('*')
      .order('name');

    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
    }

    return tags;
  }),
});
