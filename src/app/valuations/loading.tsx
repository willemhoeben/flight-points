import { Skeleton, SkeletonScreen } from "@/components/Skeleton";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function ValuationsLoading() {
  const { dict } = await getDictionary();

  return (
    <SkeletonScreen label={dict.common.loading}>
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="max-w-2xl">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-3 h-9 w-80 max-w-full" />
          <Skeleton className="mt-3 h-4 w-full" />
        </div>
        <div className="mt-8 rounded-[20px] bg-surface-muted p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="mb-2 h-11 w-full last:mb-0" />
          ))}
        </div>
        <Skeleton className="mt-10 h-64 w-full max-w-lg rounded-[20px]" />
      </div>
    </SkeletonScreen>
  );
}
