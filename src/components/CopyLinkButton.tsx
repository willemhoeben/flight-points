"use client";

import { useState } from "react";
import { useDictionary } from "@/lib/i18n/i18n-context";

/**
 * Copies the current page URL (including search params) to the clipboard.
 * Reads window.location at click time rather than via a prop, so it always
 * reflects the exact bookmarkable URL the user is looking at.
 */
export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  const dict = useDictionary();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail (permissions, insecure context) — no-op.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-brand hover:text-brand print:hidden"
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
        <path
          d="M8 12.5a2 2 0 0 0 2.83 0l2.34-2.34a2 2 0 0 0-2.83-2.83l-.79.79M12 7.5a2 2 0 0 0-2.83 0L6.83 9.84a2 2 0 0 0 2.83 2.83l.79-.79"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {copied ? dict.copyLink.copied : dict.copyLink.copy}
      <span aria-live="polite" className="sr-only">
        {copied ? dict.copyLink.copied : ""}
      </span>
    </button>
  );
}
