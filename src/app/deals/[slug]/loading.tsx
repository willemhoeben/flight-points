import { Skeleton, SkeletonScreen } from "@/components/Skeleton";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function DealLoading() {
  const { dict } = await getDictionary();

  return (
    <SkeletonScreen label={dict.common.loading}>
      <div className="mx-auto w-full max-w-3xl px-4 py-9 sm:px-6">
        <Skeleton className="h-4 w-24" />
        <div className="mt-4 flex items-center gap-3">
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        <Skeleton className="mt-3 h-9 w-full max-w-xl" />
        <Skeleton className="mt-3 h-4 w-64" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </SkeletonScreen>
  );
}
