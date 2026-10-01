import { NotFoundBody } from "@/components/NotFoundBody";
import { getDictionary } from "@/lib/i18n/get-dictionary";

/**
 * The boundary `notFound()` in this route renders into.
 *
 * Without it the call threw, the root boundary was never reached, and the
 * response came back as HTTP 200 with the right <title> and an empty body:
 * a crawler was told the URL was fine and a visitor got a blank page under
 * the nav. Co-locating the boundary with the route that throws fixes both.
 */
export default async function DealNotFound() {
  const { dict } = await getDictionary();
  return <NotFoundBody dict={dict} />;
}
