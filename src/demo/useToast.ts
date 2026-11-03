import { useCallback, useEffect, useRef, useState } from "react";

const TOAST_MS = 1800;

/** State for the demo's <Toast />: `show(text)` displays a message briefly. */
export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  // Bumped on every call so a repeated message re-triggers the enter animation
  const [id, setId] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = useCallback((text: string) => {
    clearTimeout(timer.current);
    setMessage(text);
    setId((n) => n + 1);
    timer.current = setTimeout(() => setMessage(null), TOAST_MS);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return { message, id, show };
}
