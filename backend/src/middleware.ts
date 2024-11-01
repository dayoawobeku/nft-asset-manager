import {t, TRPCError} from './utils/trpc';

export const auth = t.middleware(async ({ctx, next}) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User must be logged in',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});
