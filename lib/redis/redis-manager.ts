import { Injectable, Inject } from '@nestjs/common';
import type Redis from 'ioredis';
import { REDIS_CLIENTS, DEFAULT_REDIS_NAMESPACE } from './redis.constants';
import { RedisClients } from './interfaces';
import { CLIENT_NOT_FOUND } from '@/messages';
import { parseNamespace } from '@/utils';
import { ClientNamespace } from '@/interfaces';
import { ClientNotFoundError } from '@/errors';

@Injectable()
export class RedisManager {
    constructor(@Inject(REDIS_CLIENTS) private readonly redisClients: RedisClients) {}

    /**
     * Returns all redis clients.
     */
    get clients(): ReadonlyMap<ClientNamespace, Redis> {
        return this.redisClients;
    }

    /**
     * Retrieves a redis client by namespace.
     */
    getClient(namespace: ClientNamespace = DEFAULT_REDIS_NAMESPACE): Redis {
        const client = this.redisClients.get(namespace);
        if (!client) throw new ClientNotFoundError(CLIENT_NOT_FOUND(parseNamespace(namespace)));
        return client;
    }
}
