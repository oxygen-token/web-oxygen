import cn from "classnames";
import Link from "next/link";
import { ComponentProps, forwardRef } from "react";

type Props = {
  variant?: "medium" | "large";
  rounded?: "default" | "full";
};

export const Button = forwardRef<
  HTMLButtonElement,
  ComponentProps<"button"> & Props
>(
  (
    { children, className, variant = "medium", rounded = "default", ...props },
    forwardedRef
  ) => {
    return (
      <button
        ref={forwardedRef}
        className={cn(
          "text-white font-medium bg-green hover:bg-green-dark disabled:bg-neutral-400 disabled:text-neutral-200 transition-colors duration-300",
          {
            rounded: rounded == "default",
            "rounded-full": rounded == "full",
            "text-sm/5 py-1.5 px-3": variant == "medium",
            "text-base py-2 px-6": variant == "large",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export const LinkButton = forwardRef<
  HTMLAnchorElement,
  ComponentProps<typeof Link> & Props
>(
  (
    { children, className, variant = "medium", rounded = "default", ...props },
    forwardedRef
  ) => {
    return (
      <Link
        ref={forwardedRef}
        className={cn(
          "block text-white font-medium bg-green hover:bg-green-dark disabled:bg-neutral-400 disabled:text-neutral-200 transition-colors duration-300",
          {
            rounded: rounded == "default",
            "rounded-full": rounded == "full",
            "text-sm/5 py-1.5 px-3": variant == "medium",
            "text-base py-2 px-6": variant == "large",
          },
          className
        )}
        {...props}
      >
        {children}
      </Link>
    );
  }
);
