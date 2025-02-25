import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import {
    FAILED_CLUSTER_STATE,
    CANNOT_BE_READ,
    NOT_RESPONSIVE,
    ABNORMALLY_MEMORY_USAGE,
    MISSING_TYPE
} from '@/messages';
import { isError, promiseTimeout, removeLineBreaks, parseUsedMemory, isNullish } from '@/utils';
import { RedisCheckSettings } from './redis-check-settings.interface';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
    /**
     * Checks a redis/cluster client.
     *
     * @param key - The key which will be used for the result object
     * @param options - The extra options for check
     */
    async checkHealth(key: string, options: RedisCheckSettings): Promise<HealthIndicatorResult> {
        const { type, client } = options;
        let isHealthy = false;

        try {
            if (!type) throw new Error(MISSING_TYPE);

            if (type === 'redis') {
                const pong = await promiseTimeout(options.timeout ?? 1000, client.ping());
                if (pong !== 'PONG') throw new Error(NOT_RESPONSIVE);

                if (!isNullish(options.memoryThreshold)) {
                    const info = await client.info('memory');
                    if (parseUsedMemory(removeLineBreaks(info)) > options.memoryThreshold) {
                        throw new Error(ABNORMALLY_MEMORY_USAGE);
                    }
                }
            } else {
                const clusterInfo = await client.cluster('INFO');
                if (typeof clusterInfo === 'string') {
                    if (!clusterInfo.includes('cluster_state:ok')) throw new Error(FAILED_CLUSTER_STATE);
                } else {
                    throw new Error(CANNOT_BE_READ);
                }
            }

            isHealthy = true;
        } catch (error) {
            if (isError(error)) {
                throw new HealthCheckError(error.message, this.getStatus(key, isHealthy, { message: error.message }));
            }
        }

        return this.getStatus(key, isHealthy);
    }
}
