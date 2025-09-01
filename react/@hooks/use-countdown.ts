import { Dispatch, SetStateAction, useEffect, useState } from "react";

type UseCountdownProps = {
  onTick?: (time: number) => void;
  onTimeOut?: () => void;
  isPaused?: boolean;
  countInterval?: number;
};

export const useCountdown = (
  initialTime: number,
  options?: UseCountdownProps,
): [number, Dispatch<SetStateAction<number>>] => {
  const { onTick, onTimeOut, isPaused, countInterval } = options ?? {};

  const [timer, setTimer] = useState<number>(initialTime);

  useEffect(() => {
    if (isPaused) return;

    if (timer === 0) return onTimeOut?.();

    const interval = setInterval(() => {
      setTimer((time) => time - 1);
      onTick?.(timer);
    }, countInterval || 1000);

    return () => clearInterval(interval);
  }, [onTick, onTimeOut, timer, isPaused, countInterval]);

  return [timer, setTimer];
};
