import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface CustomInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-sky-900 mb-1">
            {label}
          </label>
        )}
        <Input
          ref={ref}
          className={cn(
            "bg-sky-50/30 text-sky-900 placeholder:text-sky-600",
            "rounded-lg shadow-sm border border-sky-500/30",
            error ? "border-red-500 focus:ring-red-500" : "",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

CustomInput.displayName = "CustomInput"
