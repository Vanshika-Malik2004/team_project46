"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config?: ChartConfig;
  }
>(({ className, config = {}, children, ...props }, ref) => {
  const keys = Object.keys(config);

  // Define chart colors using CSS variables
  React.useEffect(() => {
    const root = document.documentElement;
    keys.forEach((key) => {
      root.style.setProperty(`--color-${key}`, config[key].color);
    });

    return () => {
      keys.forEach((key) => {
        root.style.removeProperty(`--color-${key}`);
      });
    };
  }, [config, keys]);

  return (
    <div
      ref={ref}
      className={cn("h-80 w-full", className)}
      style={
        {
          "--chart-1": "212.7 26.8% 46.7%",
          "--chart-2": "269.4 22.4% 46.9%",
          "--chart-3": "32.1 89.3% 43.5%",
          "--chart-4": "162.5 45.5% 44.5%",
          "--chart-5": "333.8 71.4% 44.3%",
          "--chart-6": "242.5 48.4% 51.6%",
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
});
ChartContainer.displayName = "ChartContainer";

export { ChartContainer };
