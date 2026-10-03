"use client";

import { useState } from "react";
import { VALUATIONS, type CurrencyType, type PointCurrency } from "@/data/valuations";
import { CurrencyAmount } from "@/components/CurrencyAmount";
import { useBalances } from "@/lib/balances-context";
import { formatMiles } from "@/lib/format";
import { useDictionary, useLocale } from "@/lib/i18n/i18n-context";
import { interpolate } from "@/lib/i18n/format";
import { programsReached, reachGroups, strandedBalances, walletValueUsd } from "@/lib/wallet";

const TYPES: CurrencyType[] = ["bank", "airline", "hotel"];

/**
 * What the page shows before anyone has typed anything.
 *
 * It used to open as a form of forty zeroes under three sentences saying
 * there was nothing to show yet — a tool that does nothing until you work
 * out what to feed it, on the one page where the whole question is "what
 * would this tell me?". These three balances run through the same
 * functions as a real wallet, so the summary and the reach list are
 * genuinely computed, not mocked up.
 *
 * Nothing here is ever written to storage and the inputs stay empty, so
 * the first digit a visitor types replaces the example outright. It is
 * labelled on both panels; a worked example presented as someone's own
 * balance would be worse than the empty form it replaces.
 */
const EXAMPLE_BALANCES: Record<string, number> = {
  "chase-ur": 120000,
  "amex-mr": 65000,
  "alaska-mp": 30000,
};

export function WalletPanel() {
  const dict = useDictionary();
  const locale = useLocale();
  const { balances, setBalance, clearAll } = useBalances();
  const [query, setQuery] = useState("");

  /**
   * Name and issuer both, so "amex" finds Membership Rewards and "hyatt"
   * finds World of Hyatt. Accent- and case-insensitive, because a German
   * reader typing "lufthansa" should not have to match our capitalisation.
   */
  const normalise = (s: string) =>
    s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const needle = normalise(query.trim());
  const matches = (v: PointCurrency) =>
    needle === "" || normalise(v.name).includes(needle) || normalise(v.issuer).includes(needle);


  /**
   * A row survives the filter if it matches, or if it holds a balance. The
   * second half is what keeps the filter from losing your work: type
   * "virgin" after entering Chase and the Chase figure is still on screen,
   * still editable, rather than hidden behind an empty box.
   */
  const visibleByType = Object.fromEntries(
    TYPES.map((type) => [
      type,
      VALUATIONS.filter((v) => v.type === type && (matches(v) || balances[v.id] !== undefined)),
    ]),
  ) as Record<CurrencyType, PointCurrency[]>;

  // What is actually on screen, which is the matches plus anything held —
  // not the match count, or filtering to nothing while holding a balance
  // would claim there is nothing to show above a row that is right there.
  const visibleCount = TYPES.reduce((n, type) => n + visibleByType[type].length, 0);

  const held = Object.keys(balances).length;
  const preview = held === 0;
  const shown = preview ? EXAMPLE_BALANCES : balances;
  const groups = reachGroups(shown);
  const stranded = strandedBalances(balances);
  const typeLabel: Record<CurrencyType, string> = {
    bank: dict.valuationsTable.typeBank,
    airline: dict.valuationsTable.typeAirline,
    hotel: dict.valuationsTable.typeHotel,
  };

  return (
    <>
      {/* The three figures sit above the fold whatever you have entered, so
          the page never opens as an empty form with no idea what it does. */}
      <div className="mt-8 border-y border-border-strong py-5">
        {preview && (
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
            {dict.wallet.exampleTag}
          </p>
        )}
        <div className={preview ? "flex flex-wrap gap-x-10 gap-y-5 opacity-70" : "flex flex-wrap gap-x-10 gap-y-5"}>
          <Stat
            label={dict.wallet.totalValue}
            value={<CurrencyAmount usd={walletValueUsd(shown)} rounded />}
          />
          <Stat label={dict.wallet.currenciesHeld} value={Object.keys(shown).length} />
          <Stat label={dict.wallet.programsReached} value={programsReached(shown).length} />
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-x-12">
        <section>
          <h2 className="text-[15px] font-semibold text-foreground">{dict.wallet.balancesHeading}</h2>
          <p className="mt-1 max-w-[62ch] text-xs text-muted">{dict.wallet.privacy}</p>

          {/* Forty-eight fields down a 2,539px column, and a person holds
              three or four of them. Entering Virgin Atlantic Flying Club
              meant scrolling to y=1404 past twenty-five programmes you do
              not have — two screens of reading to reach one input.

              Typing "virgin" is the whole interaction now. The programmes
              you have already entered stay visible whatever is in the box,
              because a filter that hides your own figures is a filter that
              loses your work in front of you. */}
          <label className="mt-5 block">
            <span className="mb-1 block text-xs font-medium text-muted">{dict.wallet.findLabel}</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.wallet.findPlaceholder}
              className="form-select"
            />
          </label>

          {/* Visible, not only announced. A query that matches nothing left
              the column blank with no group headings and no message — the
              page looked broken rather than empty. aria-live carries the
              same sentence, so it is one element doing both jobs. */}
          <p
            aria-live="polite"
            className={
              query.trim() && visibleCount === 0
                ? "mt-5 bg-surface-muted p-6 text-center text-sm text-muted"
                : "sr-only"
            }
          >
            {query.trim() && visibleCount === 0
              ? interpolate(dict.wallet.findNone, { query: query.trim() })
              : ""}
          </p>

          {TYPES.map((type) => visibleByType[type].length > 0 && (
            <div key={type} className="mt-6">
              <h3 className="border-b border-border pb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                {typeLabel[type]}
              </h3>
              {visibleByType[type].map((v) => (
                <div key={v.id} className="grid grid-cols-[1fr_120px] items-center gap-3 py-1">
                  <label htmlFor={`bal-${v.id}`} className="text-sm text-foreground">
                    {v.name}
                    {/* Marked, not just left in: with a query typed, a row
                        you did not search for is there because you hold it,
                        and nothing else on the row would say so. */}
                    {query.trim() && !matches(v) && (
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                        {dict.wallet.findHeld}
                      </span>
                    )}
                  </label>
                  <input
                    id={`bal-${v.id}`}
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={balances[v.id] ?? ""}
                    onChange={(e) => setBalance(v.id, Number(e.target.value.replace(/[^0-9]/g, "")))}
                    className="form-select text-right font-mono tabular-nums"
                  />
                </div>
              ))}
            </div>
          ))}

          {held > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="mt-6 border border-border-strong px-4 py-2 text-xs font-medium text-muted transition-colors hover:text-foreground"
            >
              {dict.wallet.clear}
            </button>
          )}
        </section>

        <section className="self-start lg:sticky lg:top-14">
          <h2 className="text-[15px] font-semibold text-foreground">{dict.wallet.reachHeading}</h2>
          <p className="mt-1 max-w-[62ch] text-xs text-muted">{dict.wallet.ratioNote}</p>

          {preview && (
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
              {dict.wallet.exampleTag}
            </p>
          )}
          {groups.length === 0 ? (
            <p className="mt-6 max-w-[62ch] text-sm text-muted">{dict.wallet.reachEmpty}</p>
          ) : (
            <div className={preview ? "mt-4 opacity-70" : "mt-4"}>
              {groups.map((g) => (
                <div key={g.source.id} className="border-b border-border py-3.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="text-sm font-medium text-foreground">{g.source.name}</div>
                    <div className="shrink-0 font-mono text-[13px] tabular-nums text-foreground" suppressHydrationWarning>
                      {formatMiles(g.balance, locale)}
                    </div>
                  </div>
                  {g.direct.length > 0 && (
                    <p className="mt-2 text-[13px] leading-relaxed text-foreground">
                      <span className="block text-xs text-muted">{dict.wallet.direct}</span>
                      {g.direct.map((p) => p.name).join(" · ")}
                    </p>
                  )}
                  {g.via.length > 0 && (
                    <p className="mt-2 text-[13px] leading-relaxed text-foreground">
                      <span className="block text-xs text-muted">
                        {interpolate(
                          g.via.length === 1 ? dict.wallet.reachesOne : dict.wallet.reachesOther,
                          { count: g.via.length },
                        )}
                      </span>
                      {g.via.map((p) => p.name).join(" · ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Hotel points count toward the total but reach no airline
              program, and leaving them out of this column silently reads as
              a bug rather than an answer. */}
          {stranded.length > 0 && (
            <div className="mt-4 border-t border-border pt-3">
              <div className="text-xs text-muted">{dict.wallet.noTransfer}</div>
              <div className="mt-1 text-[13px] text-foreground">
                {stranded.map((v) => v.name).join(" · ")}
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[25px] font-medium tracking-tight tabular-nums text-brand-text" suppressHydrationWarning>
        {value}
      </div>
      <div className="mt-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
        {label}
      </div>
    </div>
  );
}
