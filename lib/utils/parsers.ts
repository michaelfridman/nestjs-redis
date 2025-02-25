import { isString } from './is';
import { ClientNamespace } from '@/interfaces';

/**
 * Parses namespace to string.
 *
 * @param namespace - The namespace of the client
 */
export const parseNamespace = (namespace: ClientNamespace): string => {
    if (isString(namespace)) return namespace;
    return namespace.toString();
};

/**
 * Replaces the line breaks with a space.
 *
 * @param text - Some text
 */
export const removeLineBreaks = (text: string): string => {
    return text.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/g, ' ');
};

/**
 * Parses used_memory to an integer.
 *
 * @param info - Memory consumption related information
 */
export const parseUsedMemory = (info: string): number => {
    const start = info.indexOf('used_memory');
    const end = info.indexOf('used_memory_human') - 1;
    return Number.parseInt(info.slice(start, end).split(':')[1], 10);
};
