"use client";

import { useState } from "react";
import { useBalances } from "@/lib/balances-context";
import { formatMiles } from "@/lib/format";
import { useDictionary, useLocale } from "@/lib/i18n/i18n-context";
import { interpolate } from "@/lib/i18n/format";
import { bestSingleReach } from "@/lib/wallet";

/**
 * Fills the explore page's budget field from what the visitor holds, so
 * "where can I go with my points" can be answered without them retyping a
 * number they already entered on /wallet.
 *
 * It writes the best SINGLE route rather than the sum of every balance:
 * the most expensive seat they could actually pay for is capped by one
 * program, so a budget built by adding programs together would list
 * destinations they cannot book.
 *
 * The form is a plain GET form, so this sets the input's value and lets the
 * visitor submit — it never navigates on their behalf.
 */
export function UseMyBalance({ inputId }: { inputId: string }) {
  const { balances } = useBalances();
  const dict = useDictionary();
  const locale = useLocale();
  const [message, setMessage] = useState<string | null>(null);

  // Nothing entered means nothing to offer, and a button that can only
  // ever report its own uselessness is worse than no button.
  if (Object.keys(balances).length === 0) return null;

  const reach = bestSingleReach(balances);

  function apply() {
    const input = document.getElementById(inputId);
    if (!(input instanceof HTMLInputElement)) return;
    if (reach <= 0) {
      setMessage(dict.explore.walletEmpty);
      return;
    }
    input.value = String(reach);
    setMessage(interpolate(dict.explore.walletUsed, { miles: formatMiles(reach, locale) }));
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <button
        type="button"
        onClick={apply}
        className="border border-border-strong px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
      >
        {dict.explore.useMyBalance}
      </button>
      <span className="text-xs text-muted" aria-live="polite" suppressHydrationWarning>
        {message}
      </span>
    </div>
  );
}
