import cn from "classnames";
import { ReactNode, ComponentProps, forwardRef } from "react";

type Props = ComponentProps<"input"> & {
  id: string;
  label: ReactNode;
};

export const CheckboxWithLabel = forwardRef<HTMLInputElement, Props>(
  ({ id, label, children, className, ...props }, forwardedRef) => {
    return (
      <label
        className={cn(
          "flex flex-row items-center gap-3 select-none",
          className
        )}
        htmlFor={id}
      >
        <div className="w-5 h-5 min-w-5 border-neutral-400 border-2 rounded-xs relative">
          <input
            type="checkbox"
            ref={forwardedRef}
            id={id}
            {...props}
            className="invisible opacity-0 absolute -translate-x-full peer"
          />
          <div className="absolute hidden peer-checked:grid place-items-center -inset-0.5 rounded-xs bg-teal-light text-white">
            <svg
              width="10"
              height="9"
              viewBox="0 0 10 9"
              className="fill-none stroke-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m.82 5.154 2.217 2.538L8.58 1.346"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <span className="font-medium text-sm/5">
          {label}
          {props.required && (
            <span className="font-normal text-neutral-700"> *</span>
          )}
        </span>
      </label>
    );
  }
);
