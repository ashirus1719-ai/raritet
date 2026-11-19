"use client";

import { useSyncExternalStore } from "react";

export type CartBook = {
  slug: string;
  title: string;
  author: string | null;
  priceKgs: number;
  coverUrl: string | null;
  coverTone: string;
  stock: number | null;
};

export type CartItem = CartBook & { quantity: number };

const STORAGE_KEY = "raritet-cart-v1";
const CHANGE_EVENT = "raritet-cart-change";
export const MAX_CART_LINES = 20;
const MAX_PER_BOOK = 10;
const EMPTY: CartItem[] = [];

export function maxQuantityFor(stock: number | null) {
  return stock === null ? MAX_PER_BOOK : Math.max(0, Math.min(stock, MAX_PER_BOOK));
}

let memoryRaw: string | null = null;
let cache: { raw: string | null; items: CartItem[] } = { raw: null, items: EMPTY };

function readRaw() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return memoryRaw;
  }
}

function parse(raw: string | null): CartItem[] {
  if (!raw) return EMPTY;
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return EMPTY;
    return value.filter((item): item is CartItem => Boolean(item) && typeof item === "object"
      && typeof item.slug === "string" && typeof item.title === "string"
      && Number.isInteger(item.quantity) && item.quantity > 0
      && Number.isFinite(item.priceKgs)).slice(0, MAX_CART_LINES);
  } catch {
    return EMPTY;
  }
}

function getSnapshot() {
  const raw = readRaw();
  if (raw !== cache.raw) cache = { raw, items: parse(raw) };
  return cache.items;
}

function getServerSnapshot() {
  return EMPTY;
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => { if (event.key === STORAGE_KEY) onChange(); };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function write(items: CartItem[]) {
  const raw = items.length ? JSON.stringify(items) : null;
  try {
    if (raw) window.localStorage.setItem(STORAGE_KEY, raw);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    memoryRaw = raw;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.priceKgs * item.quantity, 0);
}

/** Adds books to the cart and returns the quantity now in the cart for that book. */
export function addToCart(book: CartBook, quantity = 1) {
  const items = getSnapshot();
  const limit = maxQuantityFor(book.stock);
  const existing = items.find((item) => item.slug === book.slug);
  if (!existing && items.length >= MAX_CART_LINES) return 0;
  const nextQuantity = Math.min(limit, (existing?.quantity ?? 0) + quantity);
  if (nextQuantity <= 0) return 0;
  const nextItem: CartItem = { ...book, quantity: nextQuantity };
  write(existing ? items.map((item) => item.slug === book.slug ? nextItem : item) : [...items, nextItem]);
  return nextQuantity;
}

export function setCartQuantity(slug: string, quantity: number) {
  const items = getSnapshot();
  write(items.flatMap((item) => {
    if (item.slug !== slug) return [item];
    const next = Math.min(maxQuantityFor(item.stock), Math.floor(quantity));
    return next > 0 ? [{ ...item, quantity: next }] : [];
  }));
}

export function removeFromCart(slugs: string | string[]) {
  const remove = new Set(Array.isArray(slugs) ? slugs : [slugs]);
  write(getSnapshot().filter((item) => !remove.has(item.slug)));
}

export function clearCart() {
  write(EMPTY);
}
