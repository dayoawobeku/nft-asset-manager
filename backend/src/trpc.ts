// trpc.ts
import {initTRPC, TRPCError} from '@trpc/server';
import {Context} from './context';

// Initialize tRPC with context
const t = initTRPC.context<Context>().create();

// Export types and functions for creating routers, middleware, and procedures
export const router = t.router;
export const middleware = t.middleware;
export const procedure = t.procedure;
export {t, TRPCError};
