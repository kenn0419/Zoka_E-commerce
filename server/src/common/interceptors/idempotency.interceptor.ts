import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError, of, from } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { IDEMPOTENT_KEY } from '../decorators/idempotent.decorator';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const isIdempotent = this.reflector.getAllAndOverride<boolean>(
      IDEMPOTENT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isIdempotent) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const idempotencyKey = request.headers['x-idempotency-key'];

    if (!idempotencyKey) {
      throw new BadRequestException('x-idempotency-key header is required for this operation');
    }

    const cacheKey = `idempotency:${idempotencyKey}`;
    const client = this.redisService.cacheClient;

    const setSuccess = await client.set(cacheKey, 'PROCESSING', {
      NX: true,
      EX: 86400,
    });

    if (!setSuccess) {
      const existingValue = await client.get(cacheKey);

      if (existingValue === 'PROCESSING') {
        throw new ConflictException(
          'A request with this idempotency key is already being processed. Please wait or check the status.',
        );
      }

      try {
        const parsedResponse = JSON.parse(existingValue || 'null');
        return of(parsedResponse);
      } catch (e) {
        throw new ConflictException('Invalid cached state for this idempotency key.');
      }
    }

    return next.handle().pipe(
      switchMap((response) => {
        return from(
          (async () => {
            const stringifiedResponse = JSON.stringify(response !== undefined ? response : null);
            await client.set(cacheKey, stringifiedResponse, { EX: 86400 });
            return response;
          })(),
        );
      }),
      catchError((err) => {
        return from(
          (async () => {
            await client.del(cacheKey).catch(() => {});
            throw err;
          })(),
        );
      }),
    );
  }
}
