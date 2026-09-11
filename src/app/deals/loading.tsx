import { Skeleton, SkeletonScreen } from "@/components/Skeleton";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function DealsLoading() {
  const { dict } = await getDictionary();

  return (
    <SkeletonScreen label={dict.common.loading}>
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="max-w-2xl">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-9 w-96 max-w-full" />
          <Skeleton className="mt-3 h-4 w-full" />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-[20px]" />
          ))}
        </div>
      </div>
    </SkeletonScreen>
  );
}
