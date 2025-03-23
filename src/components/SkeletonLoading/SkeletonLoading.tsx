import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function SkeletonLoading({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-[var(--secondary-lavender)] animate-pulse rounded-md",
        className,
      )}
      {...props}
    />
  );
}

export { SkeletonLoading };
