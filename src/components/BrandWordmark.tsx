import { BrandMark } from "@/components/BrandMark";

/**
 * The Nightsky logo: the name set in the UI font with a four-point star
 * standing in for the dot on the "i".
 *
 * The star REPLACES the tittle rather than sitting on top of it, so the
 * visible text uses a dotless i (U+0131 "ı"). Overlaying the star on a
 * normal "i" leaves the dot poking out from behind it at every size, which
 * reads as a bug rather than a logo.
 *
 * That trade has to be paid for, and it is paid here rather than by the
 * reader:
 *   - the visual half is aria-hidden, and a visually-hidden sibling carries
 *     the real spelling, so assistive tech and the link's accessible name
 *     both get "Nightsky", never "Nıghtsky";
 *   - the visual half is `select-none`, so selecting and copying the logo
 *     yields the correctly-spelled hidden copy and not both at once.
 *
 * A name with no "i" in it falls back to plain text, which is also what
 * keeps this honest if the brand string is ever translated.
 */
export function BrandWordmark({ name, className }: { name: string; className?: string }) {
  const at = name.indexOf("i");
  if (at === -1) return <span className={className}>{name}</span>;

  return (
    <span className={className}>
      <span aria-hidden="true" className="select-none">
        {name.slice(0, at)}
        <span className="relative inline-block">
          {"ı"}
          <BrandMark className="absolute left-1/2 top-[0.04em] h-[0.36em] w-[0.36em] -translate-x-1/2 text-brand" />
        </span>
        {name.slice(at + 1)}
      </span>
      <span className="sr-only">{name}</span>
    </span>
  );
}
