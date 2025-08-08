import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// URL validation function
export const normalizeUrl = (url: string): string => {
  if (!url.trim()) return "";
  try {
    // Add protocol if missing
    const urlToTest =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;
    return urlToTest;
  } catch {
    return "";
  }
};

// isLink
export const isLink = (url: string): boolean => {
  const normalizedUrl = normalizeUrl(url?.trim() || "");
  const urlEndRegex = /\.[a-zA-Z]{2,}$/;
  return !!normalizedUrl && urlEndRegex.test(normalizedUrl);
};

// Deep equality check for plain data objects (objects, arrays, primitives, Date, RegExp)
// Cycles are supported. Functions and class instances (other than Date/RegExp) are compared by reference.
export function deepEqual(valueA: unknown, valueB: unknown): boolean {
  if (Object.is(valueA, valueB)) return true;

  if (typeof valueA !== typeof valueB) return false;

  if (valueA === null || valueB === null) return false;

  if (typeof valueA !== "object") return false;

  const seen = new WeakMap<object, object>();

  const isPlainObject = (obj: unknown): obj is Record<string, unknown> => {
    if (obj === null || typeof obj !== "object") return false;
    const proto = Object.getPrototypeOf(obj);
    return proto === Object.prototype || proto === null;
  };

  const compare = (a: unknown, b: unknown): boolean => {
    if (Object.is(a, b)) return true;
    if (typeof a !== typeof b) return false;
    if (a === null || b === null) return false;
    if (typeof a !== "object") return false;

    const objA = a as Record<string, unknown>;
    const objB = b as Record<string, unknown>;

    // Handle Date
    if (a instanceof Date || b instanceof Date) {
      return (
        a instanceof Date && b instanceof Date && a.getTime() === b.getTime()
      );
    }

    // Handle RegExp
    if (a instanceof RegExp || b instanceof RegExp) {
      return (
        a instanceof RegExp &&
        b instanceof RegExp &&
        a.source === b.source &&
        a.flags === b.flags
      );
    }

    // Handle Array
    if (Array.isArray(a) || Array.isArray(b)) {
      if (!Array.isArray(a) || !Array.isArray(b)) return false;
      if (a.length !== b.length) return false;

      // Detect cycles in arrays
      const arrA = a as unknown[];
      const arrB = b as unknown[];

      // Cycle guard
      if (seen.get(a as object) === (b as object)) return true;
      seen.set(a as object, b as object);

      for (let index = 0; index < arrA.length; index += 1) {
        if (!compare(arrA[index], arrB[index])) return false;
      }
      return true;
    }

    // For other objects, only treat plain objects as deep comparable; others by reference
    const aIsPlain = isPlainObject(objA);
    const bIsPlain = isPlainObject(objB);
    if (!aIsPlain || !bIsPlain) {
      return false;
    }

    // Cycle guard for objects
    if (seen.get(objA as object) === (objB as object)) return true;
    seen.set(objA as object, objB as object);

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;

    // Ensure same key set without sorting for performance
    for (let i = 0; i < keysA.length; i += 1) {
      const key = keysA[i];
      if (!Object.prototype.hasOwnProperty.call(objB, key)) return false;
    }

    for (let i = 0; i < keysA.length; i += 1) {
      const key = keysA[i];
      if (!compare(objA[key], objB[key])) return false;
    }
    return true;
  };

  return compare(valueA, valueB);
}

// Convenience: true if different, false if same
export function hasChanges<T>(previousValue: T, nextValue: T): boolean {
  return !deepEqual(previousValue, nextValue);
}
