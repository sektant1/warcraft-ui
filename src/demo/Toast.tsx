import { Tooltip } from "../../lib/main";

/** Tiny in-page notification used instead of blocking `alert()` popups. */
export function Toast({ message, id }: { message: string | null; id: number }) {
  return (
    <div className="demo-toast" role="status" aria-live="polite">
      {message && (
        <div key={id} className="demo-toast__inner">
          <Tooltip>
            <span style={{ color: "#fcd312" }}>{message}</span>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
