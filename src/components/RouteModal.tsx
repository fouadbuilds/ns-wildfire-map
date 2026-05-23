import { useEffect, useRef, useId } from "react";

interface EvacInfo {
  route: string;
  shelter: string;
  time: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  evac: EvacInfo | null;
  locationName?: string;
}

export default function RouteModal({
  open,
  onClose,
  evac,
  locationName,
}: Props) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const uid = useId();
  const titleId = `route-modal-title-${uid.replace(/[:]/g, "")}`;

  useEffect(() => {
    if (!open || !evac) return;

    // lock scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // save and move focus
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const el = modalRef.current;
    const focusable = el?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    (focusable ?? el)?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const container = modalRef.current;
        if (!container) return;
        const nodes = Array.from(
          container.querySelectorAll<HTMLElement>(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((n) => !n.hasAttribute("disabled"));
        if (!nodes.length) {
          e.preventDefault();
          return;
        }
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    }

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus();
    };
  }, [open, evac, onClose]);

  if (!open || !evac) return null;

  const startRoute = () => {
    const q = encodeURIComponent(evac.shelter);
    const url = `https://www.google.com/maps/search/?api=1&query=${q}`;
    window.open(url, "_blank");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-hidden={open ? "false" : "true"}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative bg-white rounded-lg shadow-xl w-105 p-5"
      >
        <h3 id={titleId} className="text-lg font-bold mb-2">
          Evacuation Plan — {locationName}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Primary route:{" "}
          <span className="font-medium text-gray-800">{evac.route}</span>
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Nearest shelter:{" "}
          <span className="font-medium text-gray-800">{evac.shelter}</span>
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Estimated drive time:{" "}
          <span className="font-semibold text-gray-800">~{evac.time} min</span>
        </p>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-1 rounded-md border">
            Close
          </button>
          <button
            onClick={startRoute}
            className="px-3 py-1 rounded-md bg-orange-500 text-white font-semibold"
          >
            Start Route
          </button>
        </div>
      </div>
    </div>
  );
}
