import { writable } from "svelte/store";

export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  function addToast(toast: Omit<Toast, "id">) {
    const id = Math.random().toString(36).substring(2);
    const duration = toast.duration || 5000;

    update((toasts) => [...toasts, { ...toast, id }]);


    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  function removeToast(id: string) {
    update((toasts) => toasts.filter((t) => t.id !== id));
  }

  function success(message: string, duration?: number) {
    addToast({ type: "success", message, duration });
  }

  function error(message: string, duration?: number) {
    addToast({ type: "error", message, duration });
  }

  function info(message: string, duration?: number) {
    addToast({ type: "info", message, duration });
  }

  function warning(message: string, duration?: number) {
    addToast({ type: "warning", message, duration });
  }

  return {
    subscribe,
    success,
    error,
    info,
    warning,
    remove: removeToast,
  };
}

export const toastStore = createToastStore();
