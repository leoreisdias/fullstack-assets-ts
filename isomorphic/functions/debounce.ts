type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
};

type DebouncedFunction<T extends (...args: any[]) => any> = {
  (this: any, ...args: Parameters<T>): void;
  cancel: () => void;
};

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: DebounceOptions = { leading: false, trailing: true }
): DebouncedFunction<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any;
  let lastCallTime: number | null = null;
  let result: ReturnType<T> | undefined;

  const invokeFunc = (time: number) => {
    if (lastArgs) {
      result = func.apply(lastThis, lastArgs);
      lastArgs = lastThis = null;
      lastCallTime = time;
    }
    return result;
  };

  const startTimer = (pendingFunc: () => void, wait: number) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(pendingFunc, wait);
  };

  const leadingEdge = (time: number) => {
    lastCallTime = time;
    startTimer(timerExpired, wait);
    return options.leading ? invokeFunc(time) : result;
  };

  const remainingWait = (time: number) => {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    return wait - timeSinceLastCall;
  };

  const shouldInvoke = (time: number) => {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    return lastCallTime === null || timeSinceLastCall >= wait;
  };

  const timerExpired = () => {
    const time = Date.now();
    if (shouldInvoke(time)) {
      trailingEdge(time);
    } else {
      startTimer(timerExpired, remainingWait(time));
    }
  };

  const trailingEdge = (time: number) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (options.trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = null;
    return result;
  };

  const debounced: DebouncedFunction<T> = function (
    this: any,
    ...args: Parameters<T>
  ) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;

    if (isInvoking) {
      if (!timeout) {
        return leadingEdge(time);
      }
      if (options.leading) {
        clearTimeout(timeout);
        startTimer(timerExpired, wait);
        return invokeFunc(time);
      }
    }

    if (!timeout) {
      startTimer(timerExpired, wait);
    }
  };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    lastArgs = lastCallTime = lastThis = timeout = null;
  };

  return debounced;
}

export { debounce };
