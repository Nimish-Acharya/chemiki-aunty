import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

// A pop-up built on the browser's native <dialog> element.
// The browser gives us focus trapping, the Escape key and a dimmed backdrop for free.
export default function Modal({ open, title, onClose, children, footer }) {
  const dialogRef = useRef(null);   // a handle to the real <dialog> element
  const titleId = useId();          // unique id so aria-labelledby works with several modals

  // When "open" changes, tell the browser to show or hide the dialog.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={titleId}
      // Escape key: let our state decide, instead of the browser closing it silently.
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      // Click on the dimmed area (the dialog element itself) closes it.
      onClick={(event) => { if (event.target === dialogRef.current) onClose(); }}
    >
      <div className="modal-header">
        <h2 id={titleId}>{title}</h2>
        <button className="icon-btn" onClick={onClose} title="Close" aria-label="Close">
          <X size={18} />
        </button>
      </div>
      {/* Only render the content while open, so inputs reset every time. */}
      {open && <div className="modal-body">{children}</div>}
      {open && footer && <div className="modal-footer">{footer}</div>}
    </dialog>
  );
}
