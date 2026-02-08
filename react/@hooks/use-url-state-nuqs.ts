// Inspired by DiceUI data-table implementation.
// Refactored and decomposed to isolate responsibilities
// such as table orchestration, pagination, and URL state.
import {
  useQueryState,
  useQueryStates,
  type Options as NuqsOptions,
  type UseQueryStatesKeysMap,
} from 'nuqs';
import { useCallback, useMemo, useState } from 'react';

type HistoryMode = 'push' | 'replace';

interface UrlStateOptions {
  /** Enable URL sync. When false, uses React local state. @default true */
  enabled?: boolean;
  /** Browser history mode. @default 'replace' */
  historyMode?: HistoryMode;
  /** Use shallow routing (no scroll, no full re-render). @default true */
  shallow?: boolean;
  /** Clear URL param when value equals default. @default true */
  clearOnDefault?: boolean;
}

/**
 * Parser with default value - result of calling .withDefault() on a nuqs parser.
 * This type captures the essential methods needed by useUrlState.
 */
interface ParserWithDefault<T> {
  readonly defaultValue: T;
  withOptions: (options: Omit<NuqsOptions, 'parse'>) => ParserWithDefault<T>;
  parse: (value: string) => T | null;
  serialize: (value: T) => string;
}

/**
 * A thin wrapper around nuqs `useQueryState` with local state fallback.
 *
 * @example
 * ```tsx
 * const [page, setPage] = useUrlState(
 *   'page',
 *   parseAsInteger.withDefault(1),
 *   { enabled: true }
 * );
 * ```
 */
export function useUrlState<T>(
  key: string,
  parser: ParserWithDefault<T>,
  options: UrlStateOptions = {}
): [T, (value: T) => void] {
  const {
    enabled = true,
    historyMode = 'replace',
    shallow = true,
    clearOnDefault = true,
  } = options;

  const nuqsOptions = useMemo<Omit<NuqsOptions, 'parse'>>(
    () => ({
      history: historyMode,
      shallow,
      scroll: false,
      clearOnDefault,
    }),
    [historyMode, shallow, clearOnDefault]
  );

  // URL state
  const [urlValue, setUrlValue] = useQueryState(
    key,
    parser.withOptions(nuqsOptions)
  );

  // Local state fallback
  const [localValue, setLocalValue] = useState<T>(parser.defaultValue);

  // Pick based on enabled
  const value = (enabled ? urlValue : localValue) as T;

  const setValue = useCallback(
    (newValue: T) => {
      if (enabled) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        void setUrlValue(newValue as any);
      } else {
        setLocalValue(newValue);
      }
    },
    [enabled, setUrlValue]
  );

  return [value, setValue];
}

/**
 * A thin wrapper around nuqs `useQueryStates` with local state fallback.
 * Enables atomic batch updates (single URL change for multiple values).
 *
 * @example
 * ```tsx
 * const [values, setValues] = useUrlStateGroup(
 *   {
 *     page: parseAsInteger.withDefault(1),
 *     perPage: parseAsInteger.withDefault(10),
 *   },
 *   { enabled: enableUrlSync }
 * );
 *
 * // Batch update (atomic, single URL change)
 * setValues({ page: 1, perPage: 20 });
 * ```
 */
export function useUrlStates<T extends UseQueryStatesKeysMap>(
  keysMap: T,
  options: UrlStateOptions = {}
): [
  { [K in keyof T]: NonNullable<ReturnType<T[K]['parse']>> },
  (values: Partial<{ [K in keyof T]: ReturnType<T[K]['parse']> }>) => void,
] {
  const {
    enabled = true,
    historyMode = 'replace',
    shallow = true,
    clearOnDefault = true,
  } = options;

  const nuqsOptions = useMemo<Omit<NuqsOptions, 'parse'>>(
    () => ({
      history: historyMode,
      shallow,
      scroll: false,
      clearOnDefault,
    }),
    [historyMode, shallow, clearOnDefault]
  );

  // URL state
  const [urlValues, setUrlValues] = useQueryStates(keysMap, nuqsOptions);

  // Local state fallback (extract defaults from keysMap)
  const defaultValues = useMemo(() => {
    const defaults = {} as { [K in keyof T]: ReturnType<T[K]['parse']> };
    for (const key of Object.keys(keysMap) as (keyof T)[]) {
      defaults[key] = keysMap[key].defaultValue;
    }
    return defaults;
  }, [keysMap]);

  const [localValues, setLocalValues] = useState(defaultValues);

  // Pick based on enabled
  const values = (enabled ? urlValues : localValues) as {
    [K in keyof T]: NonNullable<ReturnType<T[K]['parse']>>;
  };

  const setValues = useCallback(
    (newValues: Partial<{ [K in keyof T]: ReturnType<T[K]['parse']> }>) => {
      if (enabled) {
        void setUrlValues(newValues);
      } else {
        setLocalValues((prev) => ({ ...prev, ...newValues }));
      }
    },
    [enabled, setUrlValues]
  );

  return [values, setValues];
}
