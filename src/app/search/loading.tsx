import { Skeleton, SkeletonScreen } from "@/components/Skeleton";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function SearchLoading() {
  const { dict } = await getDictionary();

  return (
    <SkeletonScreen label={dict.common.loading}>
      <div className="mx-auto w-full max-w-6xl px-4 py-9 sm:px-6">
        <div className="max-w-2xl">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-3 h-9 w-72 max-w-full" />
        </div>
        <Skeleton className="mt-8 h-40 w-full rounded-[20px]" />
        <div className="mt-10">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-4 h-24 w-full rounded-[20px]" />
        </div>
        <div className="mt-10">
          <Skeleton className="h-4 w-56" />
          <div className="mt-4 rounded-[20px] bg-surface-muted p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="mb-2 h-12 w-full last:mb-0" />
            ))}
          </div>
        </div>
      </div>
    </SkeletonScreen>
  );
}
