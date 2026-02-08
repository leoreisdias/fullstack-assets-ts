// Based on DiceUI DataTable Registry: https://www.diceui.com/docs/components/data-table
import { createParser } from 'nuqs/server';
import * as z from 'zod';

import type { ExtendedColumnSort } from './types';

const sortingItemSchema = z.object({
  id: z.string().required(),
  desc: z.boolean().required(),
});

export const getSortingStateParser = <TData>(
  columnIds?: string[] | Set<string>
) => {
  const validKeys = columnIds
    ? columnIds instanceof Set
      ? columnIds
      : new Set(columnIds)
    : null;

  return createParser({
    parse: (value) => {
      try {
        // Try new string format first: "columnId:asc" or "columnId:desc"
        if (value.includes(':')) {
          const [id, direction] = value.split(':');

          // Validate column ID if validKeys is provided
          if (validKeys && !validKeys.has(id)) {
            return null;
          }

          // Validate direction
          if (direction !== 'asc' && direction !== 'desc') {
            return null;
          }

          return [
            { id, desc: direction === 'desc' },
          ] as ExtendedColumnSort<TData>[];
        }

        // Fallback to old JSON format for backward compatibility
        const parsed = JSON.parse(value);
        const arraySchema = z.array(sortingItemSchema).required();

        try {
          const validatedData = arraySchema.parse(parsed);

          if (!validatedData) return null;

          if (
            validKeys &&
            validatedData.some((item) => !validKeys.has(item.id))
          ) {
            return null;
          }

          return validatedData as ExtendedColumnSort<TData>[];
        } catch {
          return null;
        }
      } catch {
        return null;
      }
    },
    serialize: (value) => {
      // Use string format: "columnId:asc" or "columnId:desc"
      if (value.length === 0) return '';
      const firstSort = value[0];
      return `${firstSort.id}:${firstSort.desc ? 'desc' : 'asc'}`;
    },
    eq: (a, b) =>
      a.length === b.length &&
      a.every(
        (item, index) =>
          item.id === b[index]?.id && item.desc === b[index]?.desc
      ),
  });
};
