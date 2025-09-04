import cn from "classnames";
import { ReactNode, ComponentProps, forwardRef } from "react";

type Props = ComponentProps<"input"> & {
  id: string;
  label: ReactNode;
  variant?: "medium" | "large";
  rounded?: "default" | "full";
  error?: string;
};

export const InputWithLabel = forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      label,
      children,
      className,
      variant = "medium",
      rounded = "default",
      error,
      ...props
    },
    forwardedRef
  ) => {
    return (
      <div className={cn("flex flex-col justify-between min-h-[80px]", className)}>
        <label className="font-medium text-base/5 mb-2 text-white" htmlFor={id}>
          {label}
          {props.required && (
            <span className="font-normal text-white"> *</span>
          )}
        </label>
        <input
          ref={forwardedRef}
          className={cn(
            "!border-0 px-4 !placeholder:text-gray-300 !placeholder:text-[10px] !text-white/90",
            "outline-2 focus-visible:outline-green focus-visible:!border focus-visible:!border-green-500/70",
            "transition-all duration-200 appearance-none",
            "focus:!bg-[#00caa61a] hover:!bg-[#00caa61a]",
            {
              "text-sm/8": variant === "medium",
              "text-base/9": variant === "large",
              rounded: rounded === "default",
              "rounded-full": rounded === "full",
              "!outline-red-500 !outline -outline-offset-2 !border-red-500/70": error !== undefined,
            }
          )}
          style={{
            backgroundColor: '#00caa61a',
            borderColor: 'transparent',
            color: 'rgba(255, 255, 255, 0.9)'
          }}
          id={id}
          {...props}
        />
        <div className="mt-1 text-red-500 text-xs/3 min-h-4">{error}</div>
        {children}
      </div>
    );
  }
);
