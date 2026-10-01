import type { Metadata } from "next";
import { NotFoundBody } from "@/components/NotFoundBody";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.notFound.title };
}

export default async function NotFound() {
  const { dict } = await getDictionary();
  return <NotFoundBody dict={dict} />;
}
