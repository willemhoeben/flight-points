"use client";

import { useBalances } from "@/lib/balances-context";
import { formatMiles } from "@/lib/format";
import { useDictionary, useLocale } from "@/lib/i18n/i18n-context";
import { interpolate } from "@/lib/i18n/format";
import { currencyName, reachFor } from "@/lib/wallet";

/**
 * How many miles the visitor can actually put behind the airline whose map
 * they are looking at, and how they get there.
 *
 * The network page answers "where does this airline fly"; for anyone with
 * balances the next question is "and can I fly any of it". Silent until a
 * balance exists on /wallet, like every other wallet-fed line on the site.
 */
export function ProgramReach({ programId, programName }: { programId: string; programName: string }) {
  const { balances } = useBalances();
  const dict = useDictionary();
  const locale = useLocale();

  if (Object.keys(balances).length === 0) return null;

  const reach = reachFor(balances, programId);

  const line = !reach
    ? interpolate(dict.network.reachNone, { program: programName })
    : reach.via
      ? interpolate(dict.network.reachVia, {
          miles: formatMiles(reach.miles, locale),
          program: programName,
          source: currencyName(reach.via),
        })
      : interpolate(dict.network.reachDirect, {
          miles: formatMiles(reach.miles, locale),
          program: programName,
        });

  return (
    <p className="mt-1 max-w-[62ch] text-sm text-brand-text" suppressHydrationWarning>
      {line}
    </p>
  );
}
