import { useCallback, useEffect, useState } from "react";

// Runs an async function (like a service call) when the component appears
// and gives back { data, loading, error, reload }.
// The function must be stable (defined outside the component), and it receives
// { signal } so a request can be cancelled if the user leaves the page.
export function useAsync(asyncFunction) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    // Keep old data while reloading so tables do not flash empty after an action.
    setState((previous) => ({ ...previous, loading: true, error: null }));

    asyncFunction({ signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (error.name === "AbortError" || controller.signal.aborted) return;
        setState({ data: null, loading: false, error });
      });

    // Cleanup: runs when the component unmounts or before the next run.
    return () => controller.abort();
  }, [asyncFunction, reloadCount]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);
  return { ...state, reload };
}
