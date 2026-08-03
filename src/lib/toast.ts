type ToastType = "success" | "error";

export type ToastItem = { id: number; message: string; type: ToastType };

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();
let nextId = 0;
const timers = new Map<number, ReturnType<typeof setTimeout>>();

function notify() {
  listeners.forEach((l) => l([...toasts]));
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function showToast(message: string, type: ToastType) {
  const id = nextId++;
  toasts = [...toasts, { id, message, type }];
  notify();
  const timer = setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    timers.delete(id);
    notify();
  }, 4000);
  timers.set(id, timer);
}

export function dismissToast(id: number) {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

export const toast = {
  success: (message: string) => showToast(message, "success"),
  error: (message: string) => showToast(message, "error"),
};
