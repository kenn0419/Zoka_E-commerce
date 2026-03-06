import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const host = process.env.REDIS_HOST ?? '127.0.0.1';
    const port = process.env.REDIS_PORT ?? '6379';
    const password = process.env.REDIS_PASSWORD;

    const url = password
      ? `redis://:${password}@${host}:${port}`
      : `redis://${host}:${port}`;
    const pubClient = createClient({ url });
    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) => {
      console.error('Redis IoAdapter PubClient error:', err.message);
    });
    subClient.on('error', (err) => {
      console.error('Redis IoAdapter SubClient error:', err.message);
    });

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: 'http://localhost:5173',
        credentials: true,
      },
    });
    server.adapter(this.adapterConstructor);
    return server;
  }
}
