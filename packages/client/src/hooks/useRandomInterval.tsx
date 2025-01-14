import { useEffect, useRef } from "react";

export function useRandomInterval(
  callback: () => void,
  intervalMin: number,
  intervalMax: number,
) {
  const intervalSize = Math.abs(intervalMax - intervalMin);
  const clearInterval = useRef(() => {});
  function runInterval() {
    const randomInterval = intervalMax - Math.random() * intervalSize;
    const timeout = setTimeout(() => {
      callback();
      runInterval();
    }, randomInterval);
    clearInterval.current = () => clearTimeout(timeout);
  }
  useEffect(() => {
    runInterval();
  }, []);

  return clearInterval;
}
