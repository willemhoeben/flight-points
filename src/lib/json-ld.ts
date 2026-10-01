/**
 * Serialises a JSON-LD object for a `<script type="application/ld+json">`.
 *
 * `JSON.stringify` alone is not safe here, and the failure is not
 * theoretical: a deal title of `</script><script>…` closes the tag and the
 * browser runs what follows. Verified by planting one and watching it
 * execute before this existed.
 *
 * Nothing on this site takes structured data from a visitor, so there is no
 * attacker path through it today. The reason to escape anyway is that the
 * deal articles are editorial copy written in seven languages, and "our own
 * content can't be hostile" is the assumption that makes this class of bug
 * ship. Escaping costs one pass over a few hundred bytes.
 *
 * `<` and `>` cover the tag breakout. `&` keeps an escaped sequence from
 * being re-interpreted. U+2028 and U+2029 are valid JSON but terminate a
 * JavaScript line, which breaks any parser that evaluates rather than
 * parses the block.
 */
export function jsonLdHtml(value: unknown): string {
  return JSON.stringify(value)
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
