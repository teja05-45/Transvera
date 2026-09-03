"use client";

import { useSyncExternalStore } from "react";

// This is a client-only, localStorage-backed "session" so the dashboard,
// history, files, and settings screens have something real to render
// against in a preview build with no database. It is NOT a real
// authentication system — there's no server-side session, no password
// hashing, nothing protecting an API. Swapping this for Auth.js + Prisma
// sessions is Phase 4 of the planning document; the UI built against it
// here doesn't need to change shape when that happens.

export interface DemoUser {
  name: string;
  email: string;
}

const KEY = "ledgerflow_demo_session";

export function getDemoSession(): DemoUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setDemoSession(user: DemoUser) {
  window.localStorage.setItem(KEY, JSON.stringify(user));
}

export function clearDemoSession() {
  window.localStorage.removeItem(KEY);
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function notify() {
  listeners.forEach((l) => l());
}

function getSnapshot() {
  // Cheap because it's a single small JSON blob; useSyncExternalStore
  // requires a stable reference only for the *server* snapshot.
  return typeof window === "undefined" ? "" : window.localStorage.getItem(KEY) ?? "";
}

function getServerSnapshot() {
  return "";
}

// useSyncExternalStore (rather than useState + useEffect) reads localStorage
// safely across server and client renders without the extra render pass —
// and without violating the "no setState in an effect" lint rule — since
// external mutable state like localStorage is exactly what it's for.
export function useDemoSession() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const user: DemoUser | null = raw ? JSON.parse(raw) : null;

  return {
    user,
    isLoading: false,
    login: (u: DemoUser) => {
      setDemoSession(u);
      notify();
    },
    logout: () => {
      clearDemoSession();
      notify();
    },
  };
}
