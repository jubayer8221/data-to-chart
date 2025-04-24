import * as React from "react";
import { cn } from "../lib/utils";

const Button = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-[#0A3A66] text-white hover:bg-[#0F5494]/70 h-10 py-2 px-4 dark:bg-[#0A3A66]/90 dark:hover:bg-[#0F5494]/70",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
