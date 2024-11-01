import * as dotenv from 'dotenv';
dotenv.config();

import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import {fastifyTRPCPlugin} from '@trpc/server/adapters/fastify';
import {createContext} from './utils/context';
import {assetRouter} from './routes/assets';
import {uploadRouter} from './routes/upload';
import {tagRouter} from './routes/tags';
import {t} from './utils/trpc';

const PORT = Number(process.env.PORT);
const ORIGIN = process.env.ORIGIN!;

const server = fastify({
  maxParamLength: 5000,
  logger: true,
  bodyLimit: 10485760, // 10MB
});

server.register(fastifyCookie);
server.register(cors, {
  origin: [ORIGIN],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

const appRouter = t.router({
  asset: assetRouter,
  upload: uploadRouter,
  tag: tagRouter,
});

server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {router: appRouter, createContext},
});

async function start() {
  try {
    await server.listen({port: PORT}, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}
start();

export type AppRouter = typeof appRouter;
